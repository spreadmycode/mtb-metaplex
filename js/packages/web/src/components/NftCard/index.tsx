import React from 'react';
import { Card, CardProps, Button, Badge, Row, Col } from 'antd';
import { MetadataCategory, StringPublicKey } from '@oyster/common';
import { ArtContent } from './../ArtContent';
import { useArt } from '../../hooks';
import { Artist, ArtType } from '../../types';
import { MetaAvatar } from '../MetaAvatar';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';

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
    badge = 'NFT 0';
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
          <Row justify="center" align="middle">
            <Col flex={12}>
              {/* <MetaAvatar creators={creators} size={32} /> */}
              <div className="edition-badge">{badge}</div>
            </Col>
            <Col flex="auto">
              <a href={`https://explorer.solana.com/address/${pubkey}`} target="_blank">
                <Button type="text" shape="round" size="middle" className="m-2" icon={<InfoCircleOutlined />}></Button>
              </a>
            </Col>
          </Row>
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
