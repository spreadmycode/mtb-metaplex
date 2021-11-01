import { Col, Layout, Row, Button, Divider, Select, Input, InputNumber } from 'antd';
import Masonry from 'react-masonry-css';
import { CardLoader } from '../../components/MyLoader';
import { useHistory } from 'react-router-dom';
import { NftCard } from '../../components/NftCard';
import { useMeta } from '../../contexts';
import { useCreatorArts } from '../../hooks';
import { OWNER_WALLET } from '../../constants';
import { useState, useMemo } from 'react';
const { Option } = Select;

const { Content } = Layout;

export const GalleryView = () => {
    const createdMetadata = useCreatorArts(OWNER_WALLET || '');
    const { metadata, isLoading } = useMeta();
    const history = useHistory();
    const [nfts, setNfts] = useState(createdMetadata);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const artworkGrid = (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {!isLoading
            ? nfts.map((m, idx) => {
                const id = m.pubkey;
                return (
                    <NftCard
                      key={id}
                      pubkey={m.pubkey}
                      preview={true}
                      small={true}
                    />
                );
              })
            : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        </Masonry>
    );

    const handleChange = (value, type) => {

    }

    return (
        <Layout>
            <Button
                className="metaplex-button"
                onClick={_ => history.push('/')}
                >
                <span>&lt;</span>
                <span>Go back to Home</span>
            </Button>
            <Divider orientation="left">Filter by attributes</Divider>
            <Row justify="center" align="middle">
                <Col span={6} style={{width: '100%'}}>
                    <Select placeholder="Background" onChange={(value) => handleChange(value, 'Background')}>
                        <Option value="">All</Option>
                        <Option value="Yello">Yello</Option>
                        <Option value="Red">Red</Option>
                        <Option value="Blue">Blue</Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Select placeholder="Faction" onChange={(value) => handleChange(value, 'Faction')}>
                        <Option value="">All</Option>
                        <Option value="Surrealist">Surrealist</Option>
                        <Option value="Celestial">Celestial</Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Select placeholder="Type" onChange={(value) => handleChange(value, 'Type')}>
                        <Option value="">All</Option>
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <InputNumber<number>
                        min={1}
                        max={1000}
                        onChange={(value) => handleChange(value, 'Generation')}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber<number>
                        min={1}
                        max={1000}
                        onChange={(value) => handleChange(value, 'Sequence')}
                    />
                </Col>
            </Row>
            <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Row style={{ width: '100%', marginTop: 20 }} justify="center" align="middle">
                    {(!nfts || nfts.length == 0) &&
                        <h6 className="text-center text-white m-5">There is no COTD.</h6>
                    }
                    <Col>
                        {artworkGrid}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );

};