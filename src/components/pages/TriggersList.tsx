import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Text,
  Badge,
  Switch,
  Grid,
  Box,
  Title,
  Flex,
  Loader,
  Collapse,
  Divider,
  Modal,
  Table,
  LoadingOverlay,
  Tooltip,
  useMantineTheme,
  ActionIcon,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userTokenState } from '@atoms/userAtoms';
import { API_URL } from '@constants/data';
import PageFrame from '@common/PageFrame';
import {
  Icon24Hours,
  IconCheck,
  IconChevronsDown,
  IconEdit,
  IconEngine,
  IconPlus,
  IconRefresh,
  IconSquaresDiagonal,
  IconChevronDown,
} from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import { deterministicMantineColor } from '@utils/requests/utils';
import { IconChevronCompactDown } from '@tabler/icons-react';
import { List } from 'lodash';
import { createTrigger, updateTrigger } from '@utils/requests/triggerBlocks';
import { cu } from '@fullcalendar/core/internal-common';
import { currentProjectState } from '@atoms/personaAtoms';

export interface TriggerRun {
  id: number;
  run_at: string;
  completed_at: string;
  run_status: string;
  num_prospects: number;
  companies: string[];
}

export interface TriggerRunProspect {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  linkedin_url: string;
  custom_data: string;
}

const RecentRuns = ({ trigger_id, userToken }: any) => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRun, setSelectedRun]: any = useState(null);
  const [prospects, setProspects] = useState([]);
  const [prospectsData, setProspectsData]: any = useState([]);
  const [isProspectsModalOpen, setIsProspectsModalOpen] = useState(false);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/triggers/trigger/get_runs/${trigger_id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRuns(data.trigger_runs);
    } catch (error) {
      console.error('Error fetching trigger runs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRuns();
  }, [trigger_id, userToken]);

  const handleRowClick = async (run: TriggerRun) => {
    setSelectedRun(run);
    setIsProspectsModalOpen(true);
    try {
      const response = await fetch(`${API_URL}/triggers/trigger/get_prospects/${run.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const formattedProspects = data.trigger_prospects.map((prospect: TriggerRunProspect) => ({
        first_name: prospect.first_name,
        last_name: prospect.last_name,
        title: prospect.title,
        company: prospect.company,
        linkedin_url: prospect.linkedin_url,
        custom_data: prospect.custom_data,
      }));

      setProspectsData(formattedProspects);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    }
  };

  const columns = [
    { ...keyColumn('first_name', textColumn), title: 'First Name' },
    { ...keyColumn('last_name', textColumn), title: 'Last Name' },
    { ...keyColumn('title', textColumn), title: 'Title' },
    { ...keyColumn('company', textColumn), title: 'Company' },
    { ...keyColumn('linkedin_url', textColumn), title: 'LinkedIn URL' },
    { ...keyColumn('custom_data', textColumn), title: 'Custom Data' },
  ];

  const rows = runs.map((run: TriggerRun) => (
    <tr key={run.id} onClick={() => handleRowClick(run)}>
      <td>{new Date(run.run_at).toLocaleString()}</td>
      <td>{run.completed_at ? new Date(run.completed_at).toLocaleString() : 'Running'}</td>
      <td>
        <Badge
          leftSection={
            run.run_status === 'Running' ? (
              <IconEngine size={16} />
            ) : run.run_status == 'Completed' ? (
              <IconCheck size={16} />
            ) : (
              <IconSquaresDiagonal size={16} />
            )
          }
          color={
            run.run_status === 'Running'
              ? 'blue'
              : run.run_status == 'Completed'
              ? 'green'
              : 'yellow'
          }
        >
          {run.run_status}
        </Badge>
      </td>
      <td>{run.num_prospects || '-'}</td>
      <td>
        <Flex>
          {run.companies.slice(0, 2).map((company: string) => (
            <Badge mt='2px' color={deterministicMantineColor(company)} size='xs'>
              {company}
            </Badge>
          ))}
          {run.companies.length > 3 && (
            <Text fz='xs' ml='xs'>
              {'and ' + (run.companies.length - 2) + ' more'}
            </Text>
          )}
        </Flex>
      </td>
      <Button
        compact
        size='xs'
        onClick={() => setIsProspectsModalOpen(true)}
        disabled={run.num_prospects === 0}
      >
        {run.num_prospects === 0
          ? 'No prospects found'
          : 'View ' + run.num_prospects + ' prospects'}
      </Button>
    </tr>
  ));

  const convertToCSV = (headerArr: any, objArray: any) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    // add headers
    for (let index in headerArr) {
      str += headerArr[index] + ',';
    }

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line !== '') line += ',';

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  };

  const downloadCSV = () => {
    const headerArr = [
      'first_name',
      'last_name',
      'title',
      'company',
      'linkedin_url',
      'custom_data',
    ];
    const csvData = convertToCSV(headerArr, prospectsData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prospects_run_${selectedRun?.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box>
        <Box w='100%' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{ marginBottom: '10px' }}
            ml='auto'
            variant='subtle'
            compact
            mt='md'
            onClick={() => fetchRuns()}
          >
            <IconRefresh size={16} />
          </Button>
        </Box>
        <LoadingOverlay visible={loading} />
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th># Prospects Found</th>
              <th>Companies</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Box>

      <Modal
        opened={isProspectsModalOpen}
        onClose={() => setIsProspectsModalOpen(false)}
        title={`Found ${prospectsData.length} prospects`}
        size='90%'
      >
        <DataSheetGrid
          height={500}
          value={prospectsData}
          onChange={setProspectsData}
          columns={columns}
        />
        <Box w='100%' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            onClick={downloadCSV}
            style={{ marginBottom: '10px' }}
            ml='auto'
            color='orange'
            compact
            mt='md'
          >
            Download as CSV
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const TriggersList = () => {
  const [triggers, setTriggers] = useState([]);
  const [userToken] = useRecoilState(userTokenState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [shouldShowInactiveCampaign, setShouldShowInactiveCampaign] = useState(false);
  const currentProject = useRecoilValue(currentProjectState);

  const [currentOpenTrigger, setCurrentOpenTrigger] = useState(-1);

  useEffect(() => {
    const fetchTriggers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/triggers/all`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTriggers(data.triggers);
      } catch (error) {
        console.error('Error fetching triggers:', error);
      }

      setLoading(false);
    };

    fetchTriggers();
  }, [userToken]);
  const theme = useMantineTheme();
  console.log(JSON.stringify(triggers));
  return (
    <PageFrame>
      <Flex w='100%'>
        <Box>
          <Title order={3} color='gray.6'>
            Continuous Campaigns
          </Title>
          <Text color='gray'>
            SellScale will automatically find prospects from the active triggers below and add them
            to your campaigns.
          </Text>
        </Box>
        <Button
          ml='auto'
          mt='lg'
          onClick={async () => {
            if (!currentProject) return;
            const response = await createTrigger(userToken, currentProject.id);
            if (response.status === 'success') {
              const triggerId = response.data.trigger_id;
              navigate('/create-trigger?trigger_id=' + triggerId);
            }
          }}
        >
          Create New Trigger
        </Button>
      </Flex>

      {loading && (
        <Card
          mt='md'
          w='100%'
          shadow='sm'
          p='lg'
          h={'80vh'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader variant='dots' />
        </Card>
      )}

      {triggers.length === 0 && !loading && (
        <Card
          mt='md'
          w='100%'
          shadow='sm'
          p='lg'
          h={'80vh'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text mt='md' color='gray'>
            You have no triggers yet. Create a new trigger to get started.
          </Text>
          <Button
            mt='lg'
            variant='outline'
            onClick={() => navigate('/create-trigger')}
            rightIcon={<IconPlus size={16} />}
          >
            Create New Trigger
          </Button>
        </Card>
      )}

      {/* Header */}
      <Grid
        mt='md'
        w='100%'
        sx={(theme) => ({ border: `1px solid ${theme.colors.gray[4]}`, backgroundColor: 'white' })}
        p='md'
        align='center'
      >
        <Grid.Col span={5}>
          <Flex>
            <Text color='gray' fw='bold'>
              Trigger
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex>
            <Text color='gray' fw='bold'>
              Sourced
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={3}>
          <Flex>
            <Text color='gray' fw='bold'>
              Campaign
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex>
            <Text color='gray' fw='bold'>
              Details
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>

      <Grid w='100%'>
        {triggers
          .filter((trigger: any) => {
            if (shouldShowInactiveCampaign) {
              return true;
            }

            return trigger.active;
          })
          .map((trigger: any) => {
            return (
              <Box w='100%' key={trigger.id}>
                <Card shadow='sm' p='lg' withBorder>
                  <Grid justify='space-between' align='center'>
                    <Grid.Col span={5}>
                      <Flex align={'center'} gap={'sm'}>
                        <Box>
                          <Box pos={'relative'} w={32} h={32}>
                            <svg
                              width='32'
                              height='32'
                              viewBox='0 0 100 100'
                              version='1.1'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <circle
                                cx='50'
                                cy='50'
                                r='46'
                                stroke={theme.colors.blue[4]}
                                stroke-width='4'
                                stroke-dasharray='0 10'
                                stroke-linecap='round'
                                fill='transparent'
                              />
                            </svg>
                            <Icon24Hours
                              color={theme.colors.blue[4]}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                              size={'0.8rem'}
                            />
                          </Box>
                          <Box>
                            <Text color='gray.4' fw={700} align='center' fz={'xs'}>
                              Every
                            </Text>
                            <Text color='gray.8' fw={700} align='center' fz={'xs'}>
                              24H
                            </Text>
                          </Box>
                        </Box>
                        <Box>
                          <Badge size='xs' color='blue'>
                            {trigger.trigger_type.replaceAll('_', ' ')}
                          </Badge>
                          <Box
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                            onClick={() => {
                              navigate('/create-trigger?trigger_id=' + trigger.id);
                            }}
                          >
                            <Text fw='bold' size='lg'>
                              {trigger.emoji} {trigger.name}
                            </Text>
                          </Box>
                          <Text fz='xs' color='gray.6'>
                            {trigger.description}
                          </Text>
                          <Text mt='xs' color='gray' size='xs'>
                            <b>Last run:</b> {moment(trigger.last_run).format('MMM Do YYYY')} |{' '}
                            <b>Next run:</b> {moment(trigger.next_run).format('MMM Do YYYY')}
                          </Text>
                        </Box>
                      </Flex>
                    </Grid.Col>

                    <Grid.Col span={2}>
                      <Box>
                        <Flex sx={{ textAlign: 'center' }}>
                          <Tooltip label='Total number of prospects found by this trigger.'>
                            <Box
                              onClick={() => setCurrentOpenTrigger(trigger.id)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <Text fw='bold' align='center'>
                                {trigger.num_prospects_scraped}
                              </Text>
                              <Text fz='xs' color='gray' align='center'>
                                prospects
                              </Text>
                            </Box>
                          </Tooltip>
                          <Tooltip label='Total number of unique companies found by this trigger.'>
                            <Box
                              onClick={() => setCurrentOpenTrigger(trigger.id)}
                              ml='md'
                              sx={{ cursor: 'pointer' }}
                            >
                              <Text fw='bold' align='center'>
                                {trigger.num_prospect_companies}
                              </Text>
                              <Text fz='xs' color='gray' align='center'>
                                companies
                              </Text>
                            </Box>
                          </Tooltip>
                        </Flex>
                      </Box>
                    </Grid.Col>

                    <Grid.Col span={3}>
                      <Button
                        compact
                        size='sm'
                        leftIcon={<IconEdit size={16} />}
                        onClick={() => navigate(`/setup/linkedin/${trigger.client_archetype_id}`)}
                      >
                        Edit Campaign
                      </Button>
                    </Grid.Col>

                    <Grid.Col span={2}>
                      <Flex align={'center'} gap={'sm'}>
                        <Flex direction={'column'} gap={'xs'} align={'center'}>
                          <Badge color='blue'>ACTIVE</Badge>
                          <Switch
                            defaultChecked={trigger.active}
                            onClick={async () => {
                              await updateTrigger(
                                userToken,
                                trigger.id,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                !trigger.active,
                                undefined,
                                undefined
                              );
                            }}
                            color='blue'
                          />
                        </Flex>

                        <ActionIcon
                          variant='filled'
                          color='blue'
                          radius={'xl'}
                          onClick={() => {
                            if (currentOpenTrigger === trigger.id) {
                              setCurrentOpenTrigger(-1);
                            } else {
                              setCurrentOpenTrigger(trigger.id);
                            }
                          }}
                          size='sm'
                        >
                          <IconChevronDown
                            size={'0.8rem'}
                            style={{
                              transitionDuration: '400ms',
                              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                              transform:
                                currentOpenTrigger === trigger.id
                                  ? `rotate(${currentOpenTrigger === trigger.id ? 180 : 0}deg)`
                                  : 'none',
                            }}
                          />
                        </ActionIcon>
                      </Flex>
                    </Grid.Col>
                  </Grid>

                  <Collapse in={currentOpenTrigger === trigger.id}>
                    <Card withBorder mt='md' p='md'>
                      <RecentRuns trigger_id={trigger.id} userToken={userToken} />
                    </Card>
                  </Collapse>
                </Card>
              </Box>
            );
          })}
      </Grid>

      {triggers && triggers.length > 0 && (
        <Button
          mt={'md'}
          color='gray'
          radius={'xl'}
          rightIcon={
            <IconChevronDown
              size={'0.8rem'}
              style={{
                transitionDuration: '400ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transform: shouldShowInactiveCampaign
                  ? `rotate(${shouldShowInactiveCampaign ? 180 : 0}deg)`
                  : 'none',
              }}
            />
          }
          onClick={() => setShouldShowInactiveCampaign((s) => !s)}
        >
          {shouldShowInactiveCampaign ? 'Hide' : 'Show'}{' '}
          {triggers?.filter((t: any) => !t.active).length} Inactive Campaigns
        </Button>
      )}
    </PageFrame>
  );
};

export default TriggersList;
