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
    const [allNfts, setAllNfts] = useState<any>([]);
    const [nfts, setNfts] = useState<any>([]);
    const [background, setBackground] = useState('');
    const [faction, setFaction] = useState('');
    const [type, setType] = useState('');
    const [generation, setGeneration] = useState('');
    const [sequence, setSequence] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [getAll] = useMutation(GetAllMutation);
    const [backgrounds, setBackgrounds] = useState<Array<string>>([]);
    const [factions, setFactions] = useState<Array<string>>([]);
    const [types, setTypes] = useState<Array<string>>([]);
    const [generations, setGenerations] = useState<Array<string>>([]);
    const [sequences, setSequences] = useState<Array<string>>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const metadatasMut = await getAll();
            const metadatas = metadatasMut.data.getAll.metadatas;

            let tbackgrounds = new Array<string>();
            let tfactions = new Array<string>();
            let ttypes = new Array<string>();
            let tgenerations = new Array<string>();
            let tsequences = new Array<string>();
            const nfts = metadatas?.map((data: any) => {
                const nft = {pubkey: data.pubkey, metadata: JSON.parse(data.attributes)};
                const attributes = nft.metadata.attributes;
                for (let i = 0; i < attributes.length; i++) {
                    const attribute = attributes[i];
                    if (attribute.trait_type == 'Background') {
                        if (!tbackgrounds.includes(attribute.value)) {
                            tbackgrounds.push(attribute.value);
                        }
                    }
                    if (attribute.trait_type == 'Faction') {
                        if (!tfactions.includes(attribute.value)) {
                            tfactions.push(attribute.value);
                        }
                    }
                    if (attribute.trait_type == 'Type') {
                        if (!ttypes.includes(attribute.value)) {
                            ttypes.push(attribute.value);
                        }
                    }
                    if (attribute.trait_type == 'Generation') {
                        if (!tgenerations.includes(attribute.value)) {
                            tgenerations.push(attribute.value);
                        }
                    }
                    if (attribute.trait_type == 'Sequence') {
                        if (!tsequences.includes(attribute.value)) {
                            tsequences.push(attribute.value);
                        }
                    }
                }
                
                return nft;
            });
            setNfts(nfts);
            setAllNfts(nfts);

            setBackgrounds(tbackgrounds);
            setFactions(tfactions);
            setTypes(ttypes);
            setGenerations(tgenerations);
            setSequences(tsequences);

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

        for (let i = 0; i < searchParmas.length; i++) {
            if (searchParmas[i].type == _type) {
                searchParmas[i].value = _value;
            }
        }
        
        setNfts(allNfts.filter((nft: any) => {
            let searchResult = [
                {type: 'Background', value: false},
                {type: 'Faction', value: false},
                {type: 'Type', value: false},
                {type: 'Generation', value: false},
                {type: 'Sequence', value: false},
                {type: 'Input', value: false}
            ]

            const attrs = nft.metadata.attributes;
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
                <Col xl={4} xs={24} style={{margin: "10", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <label style={{ width: 150, textAlign: 'center' }}>Background :</label>
                    <Select placeholder="Background" style={{ width: 150 }} onChange={(value: string) => {setBackground(value); handleChange(value, 'Background');}}>
                        <Option value="">All</Option>
                        {
                            backgrounds.map(data => {
                                return <Option key={data} value={data}>{data}</Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: "10", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <label style={{ width: 150, textAlign: 'center' }}>Faction :</label>
                    <Select placeholder="Faction" style={{ width: 150 }} onChange={(value: string) => {setFaction(value); handleChange(value, 'Faction');}}>
                        <Option value="">All</Option>
                        {
                            factions.map(data => {
                                return <Option key={data} value={data}>{data}</Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: "10", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <label style={{ width: 150, textAlign: 'center' }}>Gender :</label>
                    <Select placeholder="Type" style={{ width: 150 }} onChange={(value: string) => {setType(value); handleChange(value, 'Type');}}>
                        <Option value="">All</Option>
                        {
                            types.map(data => {
                                return <Option key={data} value={data}>{data}</Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: "10", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <label style={{ width: 150, textAlign: 'center' }}>Generation:</label>
                    <Select placeholder="Generation" style={{ width: 150 }} onChange={(value: string) => {setGeneration(value); handleChange(value, 'Generation');}}>
                        <Option value="">All</Option>
                        {
                            generations.map(data => {
                                return <Option key={data} value={data}>{data}</Option>;
                            })
                        }
                    </Select>
                </Col>
                <Col xl={4} xs={24} style={{margin: "10", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <label style={{ width: 150, textAlign: 'center' }}>Sequence:</label>
                    <Select placeholder="Sequence" style={{ width: 150 }} onChange={(value: string) => {setSequence(value); handleChange(value, 'Sequence');}}>
                        <Option value="">All</Option>
                        {
                            sequences.map(data => {
                                return <Option key={data} value={data}>{data}</Option>;
                            })
                        }
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