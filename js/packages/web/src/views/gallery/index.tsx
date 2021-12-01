import { Col, Layout, Row, Button, Divider, Select, Input, InputNumber } from 'antd';
import Masonry from 'react-masonry-css';
import { CardLoader } from '../../components/MyLoader';
import { useHistory } from 'react-router-dom';
import { NftCard } from '../../components/NftCard';
import { useState, useEffect } from 'react';
const { Option } = Select;
const { Content } = Layout;
import { useMutation, gql } from '@apollo/client';

const GetAllMutation = gql`
  mutation GetAllMutation {
    getAll {
        metadatas {
            id
            pubkey
            attributes
        }
    }
  }
`;

export const GalleryView = () => {
    const history = useHistory();
    const [nfts, setNfts] = useState<any>([]);
    const [background, setBackground] = useState('');
    const [faction, setFaction] = useState('');
    const [type, setType] = useState('');
    const [generation, setGeneration] = useState('');
    const [sequence, setSequence] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [getAll] = useMutation(GetAllMutation);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const metadatasMut = await getAll();
            const metadatas = metadatasMut.data.getAll.metadatas;
            console.log(metadatas);
            const nfts = metadatas?.map((data: any) => {
              return {pubkey: data.pubkey, metadata: JSON.parse(data.attributes)};
            })
            setNfts(nfts);

            setIsLoading(false);
        })();
    }, []);

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
            ? nfts.map((m: any, idx) => {
                const id = m.pubkey;
                return (
                    <NftCard
                      key={id}
                      pubkey={m.pubkey}
                      image={m.metadata.image}
                      name={m.metadata.name}
                      creators={m.metadata.properties.creators}
                      preview={true}
                      small={true}
                    />
                );
              })
            : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
        </Masonry>
    );

    const handleChange = (_value: string, _type: string) => {
        let searchParmas = [
            {type: 'Background', value: background},
            {type: 'Faction', value: faction},
            {type: 'Type', value: type},
            {type: 'Generation', value: generation},
            {type: 'Sequence', value: sequence},
        ];
        
        setNfts(nfts.filter((nft: any) => {
            let searchResult = [
                {type: 'Background', value: false},
                {type: 'Faction', value: false},
                {type: 'Type', value: false},
                {type: 'Generation', value: false},
                {type: 'Sequence', value: false},
                {type: 'Input', value: false}
            ]

            let attrs = nft.metadata.attributes;
            for (let j = 0; j < attrs.length; j++) {
              const attr = attrs[j];
              for (let k = 0; k < searchParmas.length; k++) {
                  let searchParam = searchParmas[k];
                  if (searchParam.type == attr.trait_type) {
                      if (searchParam.value == '') {
                          for (let l = 0; l < searchResult.length; l++) {
                              if (searchResult[l].type == attr.trait_type) {
                                  searchResult[l].value = true;
                              }
                          }
                      } else if (searchParam.value == attr.value) {
                          for (let l = 0; l < searchResult.length; l++) {
                              if (searchResult[l].type == attr.trait_type) {
                                  searchResult[l].value = true;
                              }
                          }
                      }
                  }
              }

              if (_type == attr.trait_type) {
                  if (_value == '') {
                      searchResult[5].value = true;
                  } else if (_value == attr.value) {
                      searchResult[5].value = true;
                  }
              } 
            }
            let flag = true;
            for (let i = 0; i < searchResult.length; i++) {
                flag = flag && searchResult[i].value;
            }
            if (flag) return nft;
        }));
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
                <Col xl={4} xs={24} style={{margin: "10"}}>
                    <label>Background Type:</label>
                    <Select placeholder="Background" style={{ width: 150 }} onChange={(value: string) => {setBackground(value); handleChange(value, 'Background');}}>
                        <Option value="">All</Option>
                        <Option value="Yello">Yello</Option>
                        <Option value="Red">Red</Option>
                        <Option value="Blue">Blue</Option>
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: 10}}>
                    <label>Faction Type:</label>
                    <Select placeholder="Faction" style={{ width: 150 }} onChange={(value: string) => {setFaction(value); handleChange(value, 'Faction');}}>
                        <Option value="">All</Option>
                        <Option value="Surrealist">Surrealist</Option>
                        <Option value="Celestial">Celestial</Option>
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: 10}}>
                    <label>Gender Type:</label>
                    <Select placeholder="Type" style={{ width: 150 }} onChange={(value: string) => {setType(value); handleChange(value, 'Type');}}>
                        <Option value="">All</Option>
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: 10}}>
                    <label>Generation:</label>
                    <Select placeholder="Generation" style={{ width: 150 }} onChange={(value: string) => {setGeneration(value); handleChange(value, 'Generation');}}>
                        <Option value="">All</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: 10}}>
                    <label>Sequence:</label>
                    <Select placeholder="Sequence" style={{ width: 150 }} onChange={(value: string) => {setSequence(value); handleChange(value, 'Sequence');}}>
                        <Option value="">All</Option>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                    </Select>
                </Col>
            </Row>
            <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Row style={{ width: '100%', marginTop: 20 }} justify="center" align="middle">
                    {isLoading ?
                        <div className="w-full flex justify-center items-center">
                            <div className="loader-nts"></div>
                        </div>
                    :
                        (!nfts || nfts.length == 0) ?
                            <h6 className="text-center text-white m-5">There is no COTD.</h6>
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