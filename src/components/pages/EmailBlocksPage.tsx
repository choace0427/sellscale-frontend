import { userTokenState } from "@atoms/userAtoms";
import { EmailBlocksDND } from "@common/emails/EmailBlocksDND";
import PersonaSelect from "@common/persona/PersonaSplitSelect";
import { Button, Card, Flex, LoadingOverlay, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import getEmailBlocks from "@utils/requests/getEmailBlocks";
import getPersonas from "@utils/requests/getPersonas";
import patchEmailBlocks from "@utils/requests/patchEmailBlocks";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function EmailBlocksPage(props: { personaId?: number }) {
  const userToken = useRecoilValue(userTokenState);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeArchetype, setActiveArchetype] = useState<number[]>([]);
  const [activeArchetypeName, setActiveArchetypeName] = useState<string>("");

  const triggerGetPersonas = async () => {
    setLoading(true);
    const result = await getPersonas(userToken);

    if (result.status !== "success") {
      showNotification({
        title: "Error",
        message: "Could not get personas",
        color: "red",
      });
      return;
    }

    const personas = result.data;
    let activeArchetypes: number[] = [];
    for (const persona of personas) {
      if (persona.active) {
        activeArchetypes.push(persona.id);
        setActiveArchetypeName(persona.archetype);
        break;
      }
    }

    setActiveArchetype(activeArchetypes);
    setLoading(false);
  };

  useEffect(() => {
    triggerGetPersonas();
  }, []);

  return (
    <>
      <Flex direction="column" pos="relative">
        <LoadingOverlay visible={loading} />
        {!props.personaId && <Title>Email Blocks</Title>}
        {!props.personaId && (
          <Flex mt="md">
            <PersonaSelect
              disabled={false}
              onChange={(archetype) => {
                if (archetype.length == 0) {
                  setActiveArchetype([]);
                  return;
                }
                setActiveArchetype(archetype.map((a) => a.archetype_id));
              }}
              defaultValues={
                props.personaId ? [props.personaId] : activeArchetype
              }
              selectMultiple={false}
              label="Select One Persona"
              description="Select the persona whose email blocks you want to view."
            />
          </Flex>
        )}
        <Flex mt="md" w="100%">
          <Card w="100%" withBorder>
            {activeArchetype.length == 0 ? (
              <>
                <Text>Select a persona to view their email blocks.</Text>
              </>
            ) : (
              <Flex w="100%">
                <Flex w="40%" direction="column" pr="8px">
                  <Title order={5}>{activeArchetypeName}</Title>
                  <Text mt="md">
                    Email blocks will influence how your emails are structured
                    when generated by SellScale AI
                  </Text>
                  <Text mt="sm">
                    Take your time to create the best email blocks for your
                    persona.
                  </Text>
                  <Text mt="sm">Generation preview coming soon!</Text>
                </Flex>
                <Flex w="60%">
                  <EmailBlocksDND archetypeId={activeArchetype[0]} />
                </Flex>
              </Flex>
            )}
          </Card>
        </Flex>
      </Flex>
    </>
  );
}