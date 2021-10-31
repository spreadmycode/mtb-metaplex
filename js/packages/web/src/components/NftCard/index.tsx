import React from 'react';
import { Card, CardProps, Button, Badge } from 'antd';
import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { ArtContent } from './../ArtContent';
import { useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';
import { MetaAvatar } from '../MetaAvatar';
import { Link } from 'react-router-dom';

const { Meta } = Card;

export interface NftCardProps extends CardProps {
  pubkey?: StringPublicKey;

  image?: string;
  animationURL?: string;

  category?: MetadataCategory;

  name?: string;
  symbol?: string;
  description?: string;
  creators?: Artist[];
  preview?: boolean;
  small?: boolean;
  close?: () => void;

  height?: number;
  width?: number;
}

export const NftCard = (props: NftCardProps) => {
  let {
    className,
    small,
    category,
    image,
    animationURL,
    name,
    preview,
    creators,
    description,
    close,
    pubkey,
    height,
    width,
    ...rest
  } = props;
  const art = useArt(pubkey);
  creators = art?.creators || creators || [];
  name = art?.title || name || ' ';

  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'COTD';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }

  const card = (
    <Card
      hoverable={true}
      className={`art-card ${small ? 'small' : ''} ${className ?? ''}`}
      cover={
        <>
          {close && (
            <Button
              className="card-close-button"
              shape="circle"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                close && close();
              }}
            >
              X
            </Button>
          )}
          <ArtContent
            pubkey={pubkey}
            uri={image}
            animationURL={animationURL}
            category={category}
            preview={preview}
            height={height}
            width={width}
          />
        </>
      }
      {...rest}
    >
      <Meta
        title={`${name}`}
        description={
          <>
            <MetaAvatar creators={creators} size={32} />
            <div className="edition-badge">{badge}</div>
            <Link to={`/art/${pubkey}`}>
              <Button type="ghost" shape="round" size="small" className="m-2">...</Button>
            </Link>
          </>
        }
      />
    </Card>
  );

  return art.creators?.find(c => !c.verified) ? (
    <Badge.Ribbon text="Unverified">{card}</Badge.Ribbon>
  ) : (
    card
  );
};
