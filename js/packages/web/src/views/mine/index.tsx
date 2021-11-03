import { Col, Layout, Row, Button } from 'antd';
import Masonry from 'react-masonry-css';
import { CardLoader } from '../../components/MyLoader';
import { useHistory } from 'react-router-dom';
import { NftCard } from '../../components/NftCard';
import { useUserArts } from '../../hooks';
import { useMeta } from '../../contexts';

const { Content } = Layout;

export const MineView = () => {

    const ownedMetadata = useUserArts();
    const { metadata, isLoading } = useMeta();
    const history = useHistory();

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const items = ownedMetadata.map(m => m.metadata);

    const artworkGrid = (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {!isLoading
            ? items.map((m, idx) => {
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
            <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Row style={{ width: '100%', marginTop: 10 }} justify="center" align="middle">
                    {(!items || items.length == 0) ?
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