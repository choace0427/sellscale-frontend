import { useState, useRef, useEffect } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import {
  Card,
  HoverCard,
  Text,
  Button,
  Paper,
  Flex,
  Loader,
  ActionIcon,
  Popover,
} from "@mantine/core";
import {
  IconCircleDot,
  IconFileText,
  IconMicrophone,
  IconMicrophone2,
  IconMicrophone2Off,
} from "@tabler/icons";
import { IconCircleDotFilled, IconCircleFilled } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

type DeepGramProps = {
  onTranscriptionChanged: (text: string) => void;
  setRecording: (recording: boolean) => void;
  recording: boolean;
  showPopup?: boolean;
};

export default function DeepGram({
  recording,
  setRecording,
  onTranscriptionChanged,
  showPopup,
}: DeepGramProps) {
  const [speaking, setSpeaking] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [lastText, setLastText] = useState("");
  const deepgram = createClient("e9d9d07aa3dcd0d87ea82dbe5f91c9759f2b2319");
  const liveRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const animateScale = `
    @keyframes scale {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.4);
        opacity: 0.7;
        filter: brightness(1.2);
      }
    }

    .animate-scale {
      animation: scale 1s infinite;
      transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animateScale;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

useEffect(() => {
  if (!recording) {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (liveRef.current) {
      liveRef.current.finish();
    }
  }
}, [recording]);

const requestMicrophoneAccess = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access granted.");
  } catch (error) {
    console.error("Error accessing media devices.", error);
    showNotification({
      color: "red",
      title: "Error accessing media devices",
      message: "Permission denied. Please allow access to the microphone.",
    });
  }
};

  useEffect(() => {
    onTranscriptionChanged(transcribedText);
  }, [transcribedText]);

  const initializeLive = () => {
    const live = deepgram.listen.live({
      model: "enhanced-general",
    });

    liveRef.current = live;

    live.on(LiveTranscriptionEvents.Open, () => {
      console.log("Connection to Deepgram opened.");
    });

    live.on(LiveTranscriptionEvents.Transcript, (data) => {
      setLastText(data.channel.alternatives[0].transcript);
      if (lastText !== data.channel.alternatives[0].transcript) {
        setTranscribedText(() => " " + data.channel.alternatives[0].transcript);
      }
      console.log(data.channel.alternatives[0].transcript);
    });

    live.on(LiveTranscriptionEvents.Close, (event) => {
      console.log("Connection to Deepgram closed:", event);
      console.log("CloseEvent:", event);
      if (event.code === 1011) {
        console.error(
          "Deepgram did not receive audio data or a text message within the timeout window. See https://dpgr.am/net0001"
        );
      }

    });

    live.on(LiveTranscriptionEvents.Error, (error) => {
      console.error("Error occurred:", error);
      initializeLive();
    });
  };

  const handleToggleRecording = async () => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
      if (permissionStatus.state !== 'granted') {
        requestMicrophoneAccess();
      }
    });
    setShowAnimation(false);
    if (recording) {
      setRecording(false);
      setSpeaking(false);
      setTranscribing(false);

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (liveRef.current) {
        liveRef.current.finish();
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setTranscribedText("");
        setLastText("");
        onTranscriptionChanged("");
        setRecording(true);
        setSpeaking(true);
        setTranscribing(true);
        initializeLive();

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && liveRef.current) {
            liveRef.current.send(event.data);
          }
        };

        mediaRecorder.start(300);
      } catch (error) {
        console.error("Error accessing media devices.", error);
        showNotification({
          color: "red",
          title: "Error accessing media devices",
          message: "Permission denied. Please allow access to the microphone.",
        });
      }
    }
  };

  return (
    <div>
      <HoverCard width={280} shadow="md" withinPortal>
        <HoverCard.Target>
          {showAnimation ? (
            <Popover
              opened={showAnimation}
              position="top"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <ActionIcon
                  className="animate-scale"
                  variant={recording ? "filled" : "outline"}
                  onClick={handleToggleRecording}
                  size="md"
                  mr="xs"
                  color={recording ? "red" : "grape"}
                >
                  {recording ? (
                    <Loader variant="bars" size="xs" color="white" />
                  ) : (
                    <IconMicrophone size={"1rem"} />
                  )}
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="xs">Speak into the microphone for </Text>{" "}
                <Text size="xs">more accurate and engaging responses!</Text>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <ActionIcon
              variant={recording ? "filled" : "outline"}
              onClick={handleToggleRecording}
              size="md"
              mr="xs"
              color={recording ? "red" : "grape"}
            >
              {recording ? (
                <Loader variant="bars" size="xs" color="white" />
              ) : (
                <IconMicrophone size={"1rem"} />
              )}
            </ActionIcon>
          )}
        </HoverCard.Target>
      </HoverCard>
    </div>
  );
}
