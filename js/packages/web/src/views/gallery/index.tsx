import { Col, Layout, Row, Button } from 'antd';
import Masonry from 'react-masonry-css';
import { CardLoader } from '../../components/MyLoader';
import { useHistory } from 'react-router-dom';
import { NftCard } from '../../components/NftCard';
import { useMeta } from '../../contexts';
import { useCreatorArts } from '../../hooks';
import { OWNER_WALLET } from '../../constants';

const { Content } = Layout;

export const GalleryView = () => {
    const createdMetadata = useCreatorArts(OWNER_WALLET || '');
    const { metadata, isLoading } = useMeta();
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
            ? createdMetadata.map((m, idx) => {
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

    return (
        <Layout>
            <Button
                className="metaplex-button"
                onClick={_ => history.push('/')}
                >
                <span>&lt;</span>
                <span>Go back to Home</span>
            </Button>
            <Row justify="center" align="middle">
                <Col>
                    <p className="text-center text-white m-5">TODO: Filter components.</p>
                </Col>
            </Row>
            <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Row style={{ width: '100%', marginTop: 20 }} justify="center" align="middle">
                    {(!createdMetadata || createdMetadata.length == 0) &&
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