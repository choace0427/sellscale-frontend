import { userTokenState } from '@atoms/userAtoms';
import {
  Title,
  Text,
  Paper,
  Container,
  Checkbox,
  Stack,
  Flex,
  Popover,
  Image,
  HoverCard,
  Box,
  LoadingOverlay,
  Loader,
  Button,
  Switch,
  Divider,
} from '@mantine/core';
import { activateSubscription, deactivateSubscription, getSubscriptions } from '@utils/requests/subscriptions';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import EmailAIResponseImg from '@assets/images/notification_previews/email-ai-response.png';
import { showNotification } from '@mantine/notifications';
import { postPreviewSlackNotification } from '@utils/requests/postPreviewSlackNotification';

const image_map = new Map<string, string>([['AI_REPLY_TO_EMAIL', EmailAIResponseImg]]);

type SlackNotificationSubscription = {
  id: number;
  notification_type: string;
  notification_name: string;
  notification_description: string;
  subscription_id: number;
  subscribed: boolean;
};

export default function SlackNotifications() {
  const [loading, setLoading] = useState(false);
  const [loadingSubscriptionType, setLoadingSubscriptionType] = useState('');
  const [notificationTestLoading, setNotificationTestLoading] = useState(false);
  const userToken = useRecoilValue(userTokenState);

  const [slackSubscriptions, setSlackSubscriptions] = useState<SlackNotificationSubscription[]>([]);

  const [slackLinkedinNotification, setSlackLinkedinNotification] = useState([
    {
      title: 'Acceptea Notification - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: true,
    },
    {
      title: 'Replied Notification - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: true,
    },
    {
      title: 'Demo Set Notification - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: false,
    },
  ]);

  const [slackEmailNotification, setSlackEmailNotification] = useState([
    {
      title: 'Opened Notifications - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: true,
    },
    {
      title: 'Replied Notifications - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: false,
    },
    {
      title: 'Demo Set Notifications - Coming Soon!',
      content: `"Ariel is requesting a new card."`,
      activate: true,
    },
  ]);

  // const triggerTestNotification = async (slackNotificationID: number) => {
  //   setNotificationTestLoading(true);

  //   const result = await postPreviewSlackNotification(userToken, slackNotificationID);

  //   if (result.status === 'success') {
  //     showNotification({
  //       title: 'Success',
  //       message: 'Notification sent, please check your Slack channel!',
  //       color: 'green',
  //       autoClose: 5000,
  //     });
  //   } else {
  //     showNotification({
  //       title: 'Error',
  //       message: 'Something went wrong, please try again. Did you hookup your Slack channel?',
  //       color: 'red',
  //       autoClose: 5000,
  //     });
  //   }

  //   setNotificationTestLoading(false);
  // };

  // const triggerActivateSubscription = async (slackNotificationID: number, subscriptionType: string) => {
  //   setLoadingSubscriptionType(subscriptionType);

  //   const result = await activateSubscription(userToken, slackNotificationID);
  //   if (result.status === 'success') {
  //     triggerGetSubscriptions();
  //     showNotification({
  //       title: 'Success',
  //       message: 'Notification activated',
  //       color: 'green',
  //       autoClose: 5000,
  //     });
  //   } else {
  //     showNotification({
  //       title: 'Error',
  //       message: 'Something went wrong, please try again.',
  //       color: 'red',
  //       autoClose: 5000,
  //     });
  //   }

  //   setLoadingSubscriptionType('');
  // };

  // const triggerDeactivateSubscription = async (subscriptionId: number, subscriptionType: string) => {
  //   setLoadingSubscriptionType(subscriptionType);

  //   const result = await deactivateSubscription(userToken, subscriptionId);
  //   if (result.status === 'success') {
  //     triggerGetSubscriptions();
  //     showNotification({
  //       title: 'Success',
  //       message: 'Notification deactivated',
  //       color: 'green',
  //       autoClose: 5000,
  //     });
  //   } else {
  //     showNotification({
  //       title: 'Error',
  //       message: 'Something went wrong, please try again.',
  //       color: 'red',
  //       autoClose: 5000,
  //     });
  //   }

  //   setLoadingSubscriptionType('');
  // };

  const triggerGetSubscriptions = async () => {
    setLoading(true);

    const result = await getSubscriptions(userToken);
    if (result.status === 'success') {
      setSlackSubscriptions(result.data.slack_subscriptions);
    }

    setLoading(false);
  };

  useEffect(() => {
    triggerGetSubscriptions();
  }, []);

  return (
    <Paper withBorder m='xs' p='lg' radius='md' bg={'#fcfcfd'}>
      <Flex align={'center'} gap={'sm'}>
        <Flex direction={'column'}>
          <Text fw={600}>Customize Notifications</Text>
          <Text size={'sm'}>Subscribed to Slack alerts for the business activities listed below.</Text>
        </Flex>
      </Flex>
      <Divider my={'lg'} />
      <Flex direction={'column'} gap={'sm'}>
        <Flex direction={'column'}>
          <label
            htmlFor={'qq'}
            style={{
              borderRadius: '8px',
              width: '100%',
            }}
          >
            <Flex align={'center'} justify={'space-between'} style={{ borderRadius: '6px', border: '1px solid #dee2e6' }} p={'xs'}>
              <Flex direction={'column'}>
                <Text fw={600} mt={2} size={'sm'}>
                  AI Reply to Email
                </Text>
                <Text color='gray' size={'xs'}>
                  {`"Ariel is requesting a new card."`}
                </Text>
              </Flex>
              <Switch
                // value={item?.id}
                id={'qq'}
                size='xs'
                // onClick={() => {
                //   setData(item);
                //   setBlockList(item?.transformer_blocklist);
                // }}
                color='green'
              />
            </Flex>
          </label>
        </Flex>
        <Flex direction={'column'}>
          <label
            htmlFor={'ss'}
            style={{
              borderRadius: '8px',
              width: '100%',
            }}
          >
            <Flex align={'center'} justify={'space-between'} style={{ borderRadius: '6px', border: '1px solid #dee2e6' }} p={'xs'}>
              <Flex direction={'column'}>
                <Text fw={600} mt={2} size={'sm'}>
                  AI Reply to Email
                </Text>
                <Text color='gray' size={'xs'}>
                  {`"Ariel is requesting a new card."`}
                </Text>
              </Flex>
              <Switch
                // value={item?.id}
                id={'ss'}
                size='xs'
                // onClick={() => {
                //   setData(item);
                //   setBlockList(item?.transformer_blocklist);
                // }}
                color='green'
              />
            </Flex>
          </label>
        </Flex>
      </Flex>
      <Divider
        labelPosition='left'
        label={
          <Text fw={500} size={'lg'}>
            {' '}
            Linkedin
          </Text>
        }
        mb={'sm'}
        mt={'lg'}
      />
      <Flex direction={'column'} gap={'sm'}>
        {slackLinkedinNotification.map((item, index) => {
          return (
            <Flex direction={'column'}>
              <label
                htmlFor={item?.title}
                style={{
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                <Flex
                  align={'center'}
                  justify={'space-between'}
                  style={{ borderRadius: '6px', background: item?.activate ? '' : '#f6f6f7', border: item?.activate ? '1px solid #dee2e6' : '' }}
                  p={'xs'}
                >
                  <Flex direction={'column'}>
                    <Text fw={600} mt={2} size={'sm'} color='gray'>
                      {item?.title}
                    </Text>
                    <Text color='gray' size={'xs'}>
                      {item?.content}
                    </Text>
                  </Flex>
                  <Switch
                    checked={item.activate}
                    id={item.title}
                    size='xs'
                    onChange={() => {
                      setSlackLinkedinNotification(
                        slackLinkedinNotification.map((prev) => ({
                          ...prev,
                          activate: prev.title === item.title ? !prev.activate : prev.activate,
                        }))
                      );
                    }}
                    color='green'
                  />
                </Flex>
              </label>
            </Flex>
          );
        })}
      </Flex>
      <Divider
        labelPosition='left'
        label={
          <Text fw={500} size={'lg'}>
            {' '}
            Email
          </Text>
        }
        mb={'sm'}
        mt={'lg'}
      />
      <Flex direction={'column'} gap={'sm'}>
        {slackEmailNotification.map((item, index) => {
          return (
            <Flex direction={'column'} key={index}>
              <label
                htmlFor={item?.title}
                style={{
                  borderRadius: '8px',
                  width: '100%',
                }}
              >
                <Flex
                  align={'center'}
                  justify={'space-between'}
                  style={{
                    borderRadius: '6px',
                    background: item?.activate ? '' : '#f6f6f7',
                    border: item?.activate ? '1px solid #dee2e6' : '',
                  }}
                  p={'xs'}
                >
                  <Flex direction={'column'}>
                    <Text fw={600} mt={2} size={'sm'} color='gray'>
                      {item?.title}
                    </Text>
                    <Text color='gray' size={'xs'}>
                      {item?.content}
                    </Text>
                  </Flex>
                  <Switch
                    checked={item.activate}
                    id={item.title}
                    size='xs'
                    onChange={() => {
                      setSlackEmailNotification(
                        slackEmailNotification.map((prev) => ({
                          ...prev,
                          activate: prev.title === item.title ? !prev.activate : prev.activate,
                        }))
                      );
                    }}
                    color='green'
                  />
                </Flex>
              </label>
            </Flex>
          );
        })}
      </Flex>
    </Paper>
  );
}
