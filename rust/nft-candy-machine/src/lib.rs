use {
    anchor_lang::{
        prelude::*, solana_program::system_program, AnchorDeserialize, AnchorSerialize,
    },
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
        presale_date: u64, 
    ) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        data.total_count = total_count;
        data.remain_count = total_count;
        data.presale_count = presale_count;
        data.presale_date = presale_date;
        data.last_lamports = 0;

        Ok(())
    }

    /**
     *  Decrease presale count
     */
    pub fn decrease_presale_count(ctx: Context<Status>, index: u16) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        data.remain_count -= 1;
        data.presale_count -= 1;
        data.presale_minters.push(index);

        Ok(())
    }

    /**
     *  Decrease remain count
     */
    pub fn decrease_remain_count(ctx: Context<Status>) -> ProgramResult {
        let data = &mut ctx.accounts.data;

        data.remain_count -= 1;

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
    #[account(init, payer = user, space = 8 + 8 + 8 + 8 + 8 + 8 + 2 * 2000)]
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
    pub presale_date: u64,
    pub last_lamports: u64,
    pub presale_minters: Vec<u16>,
}
