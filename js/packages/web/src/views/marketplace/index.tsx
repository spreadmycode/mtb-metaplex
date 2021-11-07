import { Layout, Button, Row, Col } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const { Content } = Layout;

export const MarketPlace = () => {

    const history = useHistory();

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
                    <h6 className="text-center text-white m-5">Cooming soon.</h6>
                </Row>
            </Content>
        </Layout>
    );
};
