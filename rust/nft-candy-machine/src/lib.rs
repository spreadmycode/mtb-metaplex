mod whitelist;

use {
    anchor_lang::{
        prelude::*, solana_program::system_program, AnchorDeserialize, AnchorSerialize,
    },
    whitelist::WHITELIST,
};

#[program]
pub mod nft_candy_machine {
    use anchor_lang::solana_program::{
        program::{invoke},
        system_instruction,
    };

    use super::*;

    ///////////////////////////////////////////////////////////////////////////
    ///                          Smart Contract                             ///
    ///////////////////////////////////////////////////////////////////////////

    /**
     *  Initialize contract data
     */
    pub fn initialize_contract(
        ctx: Context<Initialize>, 
        total_count: u64, 
        presale_count: u64, 
        presale_start_date: u64, 
        presale_end_date: u64,
    ) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        data.total_count = total_count;
        data.remain_count = total_count;
        data.presale_count = presale_count;
        data.presale_start_date = presale_start_date;
        data.presale_end_date = presale_end_date;
        data.last_lamports = 0;
        data.check_status = 0;
        data.whitelist_index = 0;

        Ok(())
    }

    /**
     *  Check in mint possible
     */
    pub fn check_mint_possible(
        ctx: Context<Status>,
        pub_key: String,
        current_milis: u64,
    ) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        let timestamp: i64 = current_milis as i64;
        let time_start: i64 = data.presale_start_date as i64;
        let time_end: i64 = data.presale_end_date as i64;

        if data.presale_count > 0 {                                 // Case pre-sale available
            if timestamp >= time_start && timestamp <= time_end {      // Case pre-sale period
                let mut idx: u16 = 0;
                for x in &WHITELIST {
                    if pub_key == *x {                                       // Case exist in whitelist
                        let mut alreay_minted = false;
                        for a in &data.presale_minters {
                            if *a == idx {
                                alreay_minted = true;
                            }
                        }
                        if alreay_minted {                                      // Case already minter
                            data.check_status = ResultCode::AlreadyMinted as u8;
                            data.whitelist_index = 0;
                            return Ok(());
                        } else {                                                // Case new minter
                            data.check_status = ResultCode::Available as u8;
                            data.whitelist_index = idx;
                            return Ok(());
                        }
                    }
                    idx += 1;
                }                                                           // Case not exist in whitelist
                data.check_status = ResultCode::NotExistInWhiteList as u8;
                data.whitelist_index = 0;
                return Ok(());                                         
            } else {                                                    // Case free-sale period
                if timestamp > time_end {
                    data.check_status = ResultCode::PreSaleEnded as u8;
                    data.whitelist_index = 0;
                    return Ok(());
                } else {                                            // Case pre-sale not started
                    data.check_status = ResultCode::PreSaleNotStarted as u8;
                    data.whitelist_index = 0;
                    return Ok(());
                }
            }
        } else {                                                    // Case pre-sale unavailable
            data.check_status = ResultCode::PreSaleNoItem as u8;
            data.whitelist_index = 0;
            return Ok(());
        }
    }

    /**
     *  Decrease presale count
     */
    pub fn decrease_count(ctx: Context<Status>, index: u16) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        if data.remain_count > 0 {
            data.remain_count -= 1;
        }
            
        if data.presale_count > 0 {
            data.presale_count -= 1;
            data.presale_minters.push(index);
        }

        data.check_status = 0;
        data.whitelist_index = 0;
        
        Ok(())
    }

    /**
     *  Withdraw royalty
     */
    pub fn withdraw_royalty(ctx: Context<Withdraw>, lamports: u64) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        data.last_lamports = ctx.accounts.wallet.lamports();

        // Transfer royalty for gainer
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.wallet.key,
                ctx.accounts.gainer.key,
                lamports,
            ),
            &[
                ctx.accounts.wallet.clone(),
                ctx.accounts.gainer.clone(),
                ctx.accounts.system_program.clone(),
            ],
        )?;
        
        Ok(())
    }

    ////////////////////////////////////////////////////////////////////////////////////
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8 + 8 + 8 + 8 + 8 + 8 + 1 + 2 + 2 * 2000)]
    pub data: ProgramAccount<'info, Data>,
    pub user: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Status<'info> {
    #[account(mut)]
    pub data: ProgramAccount<'info, Data>,
    pub minter: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub data: ProgramAccount<'info, Data>,
    #[account(mut, signer)]
    pub wallet: AccountInfo<'info>,
    #[account(mut)]
    pub gainer: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[account]
pub struct Data {
    pub total_count: u64,
    pub remain_count: u64,
    pub presale_count: u64,
    pub presale_start_date: u64,
    pub presale_end_date: u64,
    pub last_lamports: u64,
	pub check_status: u8,
    pub whitelist_index: u16,
    pub presale_minters: Vec<u16>,    
}

pub enum ResultCode {
    Available           = 0,
    NotExistInWhiteList = 1,
    AlreadyMinted       = 2,
    PreSaleNoItem       = 3,
    PreSaleEnded        = 4,
    PreSaleNotStarted   = 5,
}

pub struct ResultData {
    pub code: ResultCode,
    pub index: u16,
}

#[error]
pub enum ErrorCode {
    #[msg("Check WhiteList occured on Error!")]
    CheckWhiteListError,
}
