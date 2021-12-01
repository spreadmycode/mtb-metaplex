import { Col, Layout, Row, Button } from 'antd';
import Masonry from 'react-masonry-css';
import { CardLoader } from '../../components/MyLoader';
import { useHistory } from 'react-router-dom';
import { NftCard } from '../../components/NftCard';
import useWalletNfts from '../../hooks/useWalletNfts';

const { Content } = Layout;

export const MineView = () => {

    const {isLoading, nfts} = useWalletNfts();
    const history = useHistory();

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
                        image={m.image}
                        name={m.name}
                        creators={m.properties.creators}
                        preview={true}
                        small={true}
                    />
                );
              })
            : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        </Masonry>
    );

    return (
        <Layout>
            <Button
                className="metaplex-button"
                onClick={_ => history.push('/')}
                >
                <span>&lt;</span>
                <span>Go back to Home</span>
            </Button>
            <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Row style={{ width: '100%', marginTop: 10 }} justify="center" align="middle">
                    {isLoading ?
                        <div className="w-full flex justify-center items-center">
                            <div className="loader-nts"></div>
                        </div>
                    :
                        (!nfts || nfts.length == 0) ?
                            <h6 className="text-center text-white m-5">You have no COTD.</h6>
                            :
                            <Col>
                                {artworkGrid}
                            </Col>
                    }
                </Row>
            </Content>
        </Layout>
    );

};