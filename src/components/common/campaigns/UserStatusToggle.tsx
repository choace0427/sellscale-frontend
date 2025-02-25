import { userTokenState } from '@atoms/userAtoms';
import { Loader, Switch, Text, Title } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconMailPause } from '@tabler/icons-react';
import { activatePersona } from '@utils/requests/postPersonaActivation';
import { deactivatePersona } from '@utils/requests/postPersonaDeactivation';
import { set } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const UserStatusToggle: React.FC<{
  projectId?: number;
  isActive?: boolean;
  onChangeUserStatusSuccess: (status: boolean) => void;
}> = ({ projectId, isActive = false, onChangeUserStatusSuccess }) => {
  const token = useRecoilValue(userTokenState);
  const [loading, setLoading] = useState(false);

  const triggerBasicPersonaDeactivation = async () => {
    if (!projectId) {
      alert('No current project');
      return;
    }

    const result = await deactivatePersona(token, projectId, false);
    if (result.status === 'success') {
      onChangeUserStatusSuccess?.(false);
      showNotification({
        title: 'Campaign Deactivated',
        message: 'Your campaign has been deactivated.',
        color: 'blue',
      });
    } else {
      showNotification({
        title: 'Error',
        message: 'There was an error deactivating your campaign.',
        color: 'red',
      });
    }
  };

  const triggerHardPersonaDeactivation = async () => {
    if (projectId == null) {
      alert('No current project');
      return;
    }

    const result = await deactivatePersona(token, projectId, true);
    if (result.status === 'success') {
      onChangeUserStatusSuccess?.(false);
      showNotification({
        title: 'Campaign Deactivated',
        message: 'Your campaign has been deactivated.',
        color: 'blue',
      });
    } else {
      showNotification({
        title: 'Error',
        message: 'There was an error deactivating your campaign.',
        color: 'red',
      });
    }
  };

  const triggerActivatePersona = async () => {
    if (!projectId) {
      alert('No current project');
      return;
    }

    const result = await activatePersona(token, projectId);
    if (result.status === 'success') {
      onChangeUserStatusSuccess?.(true);
      // showNotification({
      //   title: 'Campaign Activated',
      //   message: 'Your campaign has been activated.',
      //   color: 'green',
      // });
    } else {
      showNotification({
        title: 'Error',
        message: 'There was an error activating your campaign.',
        color: 'red',
      });
    }
  };

  const handleUserStatusChanges = async () => {
    setLoading(true);
    if (isActive) {
      openConfirmModal({
        title: <Title order={3}>Deactivate Campaign</Title>,
        children: (
          <>
            <Text fs='italic'>Please read the deactivation options below carefully.</Text>
            <Text mt='md'>
              <b>Pause Campaign:</b> Pausing this campaign will prevent any new message generation,
              but Prospects still in the pipeline will continue to receive messages.
            </Text>
            <Text mt='xs'>
              <b>Finish Campaign:</b> Finishing this campaign will wipe all messages from the
              pipeline and stop any and all contact with Prospects. This will also move all
              uncontacted prospects in this campaign to the unassigned campaign.
            </Text>
          </>
        ),
        labels: {
          confirm: 'Pause Campaign',
          cancel: 'Finish Campaign',
        },
        cancelProps: { color: 'red', variant: 'outline' },
        confirmProps: { color: 'red' },
        onCancel: () => {
          triggerHardPersonaDeactivation();
        },
        onConfirm: () => {
          triggerBasicPersonaDeactivation();
        },
      });
    } else {
      setLoading(true);
      await triggerActivatePersona();
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loader size="sm" />
      ) : (
        <Switch
          checked={isActive}
          size='sm'
          sx={{ cursor: 'pointer' }}
          onClick={handleUserStatusChanges}
        />
      )}
    </>
  );
};

export default UserStatusToggle;
