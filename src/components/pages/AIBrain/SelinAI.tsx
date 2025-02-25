import {
  emailSequenceState,
  emailSubjectLinesState,
  userDataState,
  userTokenState,
} from "@atoms/userAtoms";
import posthog from "posthog-js";
import { TransformedSegment } from "@pages/SegmentV3/SegmentV3";
import { JSONContent } from "@tiptap/react";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Loader,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  Badge,
  SegmentedControl,
  Center,
  Collapse,
  ThemeIcon,
  Stack,
  List,
  Select,
  Title,
  Textarea,
  Popover,
  LoadingOverlay,
  Kbd,
  Group,
  Tooltip,
  HoverCard,
  Table,
  Input,
  NativeSelect,
  Switch,
  Checkbox,
  Slider,
  Stepper,
  Progress,
} from "@mantine/core";
import {
  IconAdjustments,
  IconArchive,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconArrowsMove,
  IconBolt,
  IconBrain,
  IconBrowser,
  IconBulb,
  IconCheck,
  IconCheckbox,
  IconChecklist,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconClock,
  IconClockHour12,
  IconCloud,
  IconEar,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFile,
  IconFlask,
  IconGripVertical,
  IconHammer,
  IconHistory,
  IconHourglassLow,
  IconInfoCircle,
  IconLink,
  IconList,
  IconLoader,
  IconMail,
  IconParachute,
  IconPencil,
  IconPlus,
  IconPoint,
  IconPuzzle,
  IconSend,
  IconSettings,
  IconTooltip,
  IconTrash,
  IconTriangleInverted,
  IconX,
} from "@tabler/icons";
import SlackLogo from "@assets/images/slack-logo.png";
import { IconClock24, IconSparkles, IconUserShare } from "@tabler/icons-react";
import moment from "moment";
import {
  createContext,
  Dispatch,
  Fragment,
  Key,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import React, { forwardRef, useImperativeHandle } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { proxyURL } from "@utils/general";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import RichTextArea from "@common/library/RichTextArea";

import Logo from "../../../assets/images/logo.png";
import { API_URL } from "@constants/data";
import { useDisclosure } from "@mantine/hooks";
// import SelinAIPlanner from "./SelinAIPlanner";
import ComingSoonCard from "@common/library/ComingSoonCard";
import SegmentV3 from "@pages/SegmentV3/SegmentV3";
import CampaignLandingV2 from "@pages/CampaignV2/CampaignLandingV2";
import WhatHappenedLastWeek from "./WhatHappenedLastWeek";
import AIBrainStrategy from "@pages/Strategy/AIBrainStrategy";
// import SelinStrategy from "@pages/Strategy/Selinstrategy";
import { socket } from "../../App";
import { showNotification } from "@mantine/notifications";
import { useStrategiesApi } from "@pages/Strategy/StrategyApi";
import { openContextModal } from "@mantine/modals";
import DeepGram from "@common/DeepGram";

interface CustomCursorWrapperProps {
  children: React.ReactNode;
  setPrompt: Dispatch<SetStateAction<string>>;
  prompt: string;
  setAttachedFile: (file: File) => void;
  handleSubmit: (file: {
    name: string;
    base64: string;
    description: string;
  }) => void;
}

import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { Modal, Overlay } from "@mantine/core";
import { currentProjectState } from "@atoms/personaAtoms";
import {
  getFreshCurrentProject,
  isFreeUser,
  saveCurrentPersonaId,
} from "@auth/core";
import Tour from "reactour";
import { useNavigate } from "react-router-dom";
import Sequences from "@pages/CampaignV2/Sequences";
import { SubjectLineTemplate } from "src";
import { ArchetypeFilters } from "@pages/CampaignV2/ArchetypeFilterModal";
import SellScaleAssistant from "./SellScaleAssistant";
import Personalizers from "@pages/CampaignV2/Personalizers";
import ContactAccountFilterModal from "@modals/ContactAccountFilterModal";
import UploadProspectsModal from "@modals/UploadProspectsModal";
import { SequencesV2 } from "@pages/CampaignV2/SequencesV2";
import { set } from "lodash";
import { setSmartleadCampaign } from "@utils/requests/setSmartleadCampaign";
import SelixMemoryLogs, { MemoryLog } from "./SelinMemoryLogs";
import { Draggable } from "react-beautiful-dnd";
import { isInt } from "@fullcalendar/core/internal";
import { Calendar, TimeInput } from "@mantine/dates";
import AssetLibraryV2 from "@pages/AssetLibrary/AssetLibraryV2";
import CompanySegmentReview from "@pages/SegmentV2/CompanySegmentReview";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { PopoverTarget } from "@mantine/core/lib/Popover/PopoverTarget/PopoverTarget";
import { SelixAutoExecuteModal } from "./SelixAutoExecuteModal";

const DropzoneWrapper = forwardRef<unknown, CustomCursorWrapperProps>(
  ({ children, handleSubmit, setAttachedFile, setPrompt, prompt }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState("");

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        setAttachedFile(files[0]);
        setFile(files[0]);

        showNotification({
          title: "File dropped",
          message: `File: ${files[0].name} has been attached`,
          color: "blue",
          icon: <IconCircleCheck />,
        });

        // setIsModalOpen(true);
      }
      setIsDragging(false);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleConfirm = () => {
      console.log("File confirmed:", file);
      setIsModalOpen(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1] || "";
        handleSubmit({
          name: file?.name || "",
          base64: base64String,
          description: fileDescription,
        });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    };

    useImperativeHandle(ref, () => ({
      handleDrop: (file: File) => {
        setFile(file);
        setAttachedFile(file);
        // setIsModalOpen(true);
      },
      handleConfirm,
    }));

    useEffect(() => {
      const dropArea = document.getElementById("drop-area");
      dropArea?.addEventListener("dragover", handleDragOver);
      dropArea?.addEventListener("dragleave", handleDragLeave);
      dropArea?.addEventListener("drop", handleDrop);

      return () => {
        dropArea?.removeEventListener("dragover", handleDragOver);
        dropArea?.removeEventListener("dragleave", handleDragLeave);
        dropArea?.removeEventListener("drop", handleDrop);
      };
    }, []);

    return (
      <div id="drop-area">
        {isDragging && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)",
              color: "white",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Drop files here
          </div>
        )}
        {children}
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add File to Chat"
        >
          <Flex align="center" mt="md">
            <IconFile size={20} />
            <Text ml="xs">{file?.name}</Text>
          </Flex>
          <Textarea
            placeholder="Enter file description..."
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            minRows={3}
            mt="md"
          />
          <Group position="right" mt="md">
            <Button onClick={handleConfirm}>Confirm</Button>
          </Group>
        </Modal>
      </div>
    );
  }
);

DropzoneWrapper.displayName = "DropzoneWrapper";

interface TaskType {
  order_number: number;
  proof_of_work_img: string | null;
  id: number;
  title: string;
  description?: string;
  status:
    | "QUEUED"
    | "IN_PROGRESS"
    | "IN_PROGRESS_REVIEW_NEEDED"
    | "COMPLETE"
    | "CANCELLED"
    | "BLOCKED";
  created_at: string;
  updated_at: string;
  selix_session_id: number;
  rewind_img: string | null;
  widget_type?: string;
}

export interface MemoryType {
  additional_context: string;
  counter: number;
  session_name: string;
  strategy_id: number;
  campaign_id: number;
  memory_state: string;
  session_mode?: string;
  memory_line_time_updated?: string;
  old_memory_line?: string;
  old_memory_line_time_updated?: string;
  company_segment_id?: number;
  session_current_goal?: string;
  memory_line?: string;
  tab: "STRATEGY_CREATOR" | "PLANNER" | "BROWSER" | "ICP" | "ASSETS";
  search?: {
    query: string;
    response: string;
    citations: string[];
    images: {
      image_url: string;
      origin_url: string;
      height: number;
      width: number;
    }[];
  }[];
}

export interface ThreadType {
  id: number;
  session_name: string;
  status:
    | "ACTIVE"
    | "COMPLETE"
    | "CANCELLED"
    | "PENDING_OPERATOR"
    | "BLOCKED"
    | "IN_PROGRESS";
  assistant_id: string;
  client_sdr_id: number;
  created_at: string;
  updated_at: string;
  estimated_completion_time: string | null;
  actual_completion_time: string | null;
  memory: MemoryType;
  tasks: TaskType[];
  thread_id: string;
  is_supervisor_session: boolean;
  is_ingestion_session: boolean;
}

interface SuggestedMessage {
  client_id: number;
  id: number;
  name: string;
  status: string;
  strategy_id: number;
  transcript: string;
}

interface MessageType {
  created_time: string;
  message: string;
  role: "user" | "assistant" | "system";
  sender_name?: string; // Used for Slack messages, sometimes the sender name is different from us in the thread
  type: "message" | "strategy" | "planner" | "analytics" | "action" | "slack";
  action_description?: string;
  slack_channel?: string;
  action_title?: string;
  action_function?: string;
  action_params?: {
    title: string;
    description: string;
  };
  hidden_until?: Date;
  actual_completion_time?: string | null;
  id?: number;
  selix_session_id?: number;
}

export default function SelinAI() {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const roomIDref = useRef<string>("");
  const deviceIDRef = useRef<string>(
    Math.random().toString(36).substring(2, 15)
  );
  const [currentSessionId, setCurrentSessionId] = useState<Number | null>(null);
  const sessionIDRef = useRef<Number>(-1);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [refreshAssetLibrary, setRefreshAssetLibrary] = useState<number>(0);
  const [prompt, setPrompt] = useState("");
  const promptRef = useRef<string>("");
  const promptLengthRef = useRef<number>(0);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionHidden, setSuggestionHidden] = useState(true);
  const [suggestedFirstMessage, setSuggestedFirstMessage] = useState<
    (string | SuggestedMessage)[]
  >([]);
  const [recording, setRecording] = useState(false);
  const [attachedInternalTask, setAttachedInternalTask] = useState<
    TaskType | undefined
  >(undefined);
  const prevPromptLengthRef = useRef<number>(0);
  const prevSlideUpTime = useRef<number>(0);
  const dropzoneRef = useRef<{
    handleDrop: (file: File) => void;
    handleConfirm: () => void;
  } | null>(null);

  const freeUser = isFreeUser();

  const navigate = useNavigate();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSessionName, setEditingSessionName] = useState<string>("");

  // Active threads in 'Active Sessions'
  const activeThreads = threads
    .filter(
      (thread) =>
        thread.status &&
        thread.status !== "COMPLETE" &&
        thread.status !== "CANCELLED" &&
        !(
          thread.tasks && thread.tasks.some((task) => task.status === "BLOCKED")
        )
    )
    .sort((a, b) => b.id - a.id);
  // Blocked threads in 'Need Input'
  const needInputThreads = threads
    .filter(
      (thread) =>
        thread.status &&
        thread.status !== "COMPLETE" &&
        thread.status !== "CANCELLED" &&
        thread.tasks &&
        thread.tasks.some((task) => task.status === "BLOCKED")
    )
    .sort((a, b) => b.id - a.id);

  console.log("need input threads length is", needInputThreads.length);

  // Completed threads
  const completedThreads = threads
    .filter(
      (thread) =>
        thread.status &&
        (thread.status === "COMPLETE" || thread.status === "CANCELLED")
    )
    .sort((a, b) => b.id - a.id);

  const editSession = (sessionId: number, newName: string) => {
    setEditingIndex(null);
    setThreads((prevThreads) =>
      prevThreads.map((prevThread) =>
        prevThread.id === sessionId
          ? { ...prevThread, session_name: newName }
          : prevThread
      )
    );
    fetch(`${API_URL}/selix/edit_session`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        new_name: newName,
      }),
    });
  };

  const isInternal = window.location.href.includes("internal");
  const onDragEnd = async (result: {
    destination: { index: number };
    source: { index: number };
  }) => {
    if (!isInternal) {
      return;
    }
    if (!result.destination) {
      return;
    }
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Update the state with the reordered tasks
    setTasks(reorderedTasks);

    // Call the API to reorder the tasks
    try {
      const response = await fetch(`${API_URL}/selix/reorder-tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          tasks: reorderedTasks.map((task, index) => ({
            id: task.id,
            order: index,
          })),
        }),
      });

      if (!response.ok) {
        console.error("Failed to reorder tasks");
      }
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  // console.log("current session is", currentSessionId);

  useEffect(() => {
    posthog.onFeatureFlags(function () {
      if (posthog.isFeatureEnabled("show-calendly-for-signup") && freeUser) {
        navigate("/selix_onboarding");
      }
    });
  }, []);

  const handleSubmit = async (
    file?: { name: string; description: string; base64: string },
    forcePrompt?: string,
    sendAsSelix?: boolean,
    sendSlack?: boolean,
    sendEmail?: boolean,
    scheduleDay?: Date
  ) => {
    let messagToSend = forcePrompt || prompt;

    // if (prompt === 'File Description: '){

    //   showNotification({
    //     title: "File upload failed",
    //     message: "Please enter a file description",
    //     color: "red",
    //     icon: <IconCircleCheck />,
    //   });
    //   return;

    // }

    setRecording(false);
    //custom handle submit function to handle file uploads

    if (attachedFile) {
      console.log("attached file is", attachedFile);
      dropzoneRef.current?.handleConfirm();
      setAttachedFile(null);
      return;
    }

    if (file) {
      console.log("submitting file", file);

      setMessages((chatContent: MessageType[]) => [
        ...chatContent,
        {
          hidden_until: scheduleDay,
          created_time: moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
          message: prompt,
          role: sendAsSelix ? "assistant" : "user",
          type: "message",
        },
      ]);

      setPrompt("");
      promptRef.current = "";
      promptLengthRef.current = 0;
      setSuggestion("");
      prevPromptLengthRef.current = 0;

      const response = await fetch(`${API_URL}/selix/upload_file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          // device_id: deviceIDRef.current,
          session_id: sessionIDRef.current,
          device_id: deviceIDRef.current,
          file: file.base64,
          file_name: file.name,
          description: prompt,
        }),
      });

      if (response.status === 400) {
        showNotification({
          title: "File upload failed",
          message: "Please try uploading a file less than 5mb in size!",
          color: "red",
          icon: <IconCircleCheck />,
        });
        return;
      }

      if (response.status === 429) {
        showNotification({
          title: "File upload failed",
          message:
            "You have reached the maximum file upload count! Please reach out to csm@sellscale.com",
          color: "red",
          icon: <IconCircleCheck />,
        });
        return;
      }

      return;
    }

    if (messagToSend.trim() !== "") {
      const newChatPrompt: MessageType = {
        created_time: moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
        hidden_until: scheduleDay,
        message: messagToSend,
        role: sendAsSelix ? "assistant" : "user",
        type: "message",
      };
      setMessages((chatContent: MessageType[]) => [
        ...chatContent,
        newChatPrompt,
      ]);

      setPrompt("");
      setSuggestion("");
      prevPromptLengthRef.current = 0; //this is used while recording
      slideDown();
      // setLoading(true);

      if (!sendAsSelix) {
        const loadingMessage: MessageType = {
          hidden_until: scheduleDay,
          created_time: moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
          message: "loading",
          role: "assistant",
          type: "message",
        };

        setMessages((chatContent: MessageType[]) => [
          ...chatContent,
          loadingMessage,
        ]);
      }

      try {
        const response = await fetch(`${API_URL}/selix/create_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            as_assistant: sendAsSelix,
            send_slack: sendSlack,
            send_email: sendEmail,
            device_id: deviceIDRef.current,
            session_id: currentSessionId,
            message: messagToSend,
            scheduleDay: scheduleDay,
            task_id: attachedInternalTask?.id,
            intendedTaskChange: intendedTaskChange,
          }),
        });

        await response;
        // if (data.status === "OK") {
        //   // Fetch the updated messages
        //   await getMessages(currentThreadID.current);
        // }
      } catch (error) {
        console.error("Error creating message:", error);
      } finally {
        // setLoading(false);
        // setPrompt("");
      }
    }
  };

  const handleEditStrategy = async (prompt: string) => {
    const response = await fetch(`${API_URL}/selix/edit_strategy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        session_id: currentSessionId,
        message: prompt,
      }),
    });

    const data = await response;
  };

  const get_one_suggested_first_message = async () => {
    if (suggestedFirstMessage.length > 0) {
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/selix/get_one_suggested_first_message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            device_id: deviceIDRef.current,
            room_id: roomIDref.current,
          }),
        }
      );
      const data = await response.json();
      console.log("data is", data);
      setSuggestedFirstMessage(data.messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // console.log('current session thread is', threads.find((thread) => thread.id === currentSessionId));

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/selix/get_all_threads`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      console.log("data is", data);
      setThreads(data);

      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get("session_id");
      const threadIdFromUrl = urlParams.get("thread_id");

      // Clear the URL parameters from the input bar
      if (sessionIdFromUrl || threadIdFromUrl) {
        return data || [];
      }

      // console.log("data is", data);
      if (data.length > 0) {
        getMessages(data[0].thread_id, data[0].id, data);
      }
      if (data.length === 0) {
        handleCreateNewSession();
        setAIType("PLANNER");
      }
      return data || [];
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  const getMessages = async (
    thread_id: string,
    session_id: Number,
    threads_passed?: ThreadType[],
    tab_override?: string
  ) => {
    setLoadingNewChat(true);
    try {
      // create new room_id
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("session_id", session_id.toString());
      if (window.location.href.includes("internal")) {
        urlParams.set("internal", "true");
      } else {
        urlParams.delete("internal");
      }
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

      navigate(
        { pathname: location.pathname, search: urlParams.toString() },
        { replace: true }
      );

      window.history.replaceState({}, "", newUrl);

      setCurrentSessionId(session_id);
      sessionIDRef.current = session_id;
      roomIDref.current = thread_id;

      get_one_suggested_first_message();

      socket.emit("join-room", {
        payload: { room_id: thread_id },
      });

      const response = await fetch(`${API_URL}/selix/get_messages_in_thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ thread_id: thread_id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredMessages = data.filter(
        (message: MessageType) => message.message !== "Acknowledged."
      );
      setMessages(filteredMessages);
      const currentThread =
        threads_passed?.find((thread) => thread.id === session_id) ||
        threads.find((thread) => thread.id === session_id);

      // SPECIAL PARSING FOR SLACK MESSAGES
      const transformedMessages = filteredMessages.map(
        (message: MessageType) => {
          if (
            message.message?.includes("SLACK MESSAGE") ||
            message.message?.includes("SUPPORT THREAD SLACK")
          ) {
            try {
              const parsedMessage = JSON.parse(message.message);

              const sender_name = parsedMessage.title.split(" sent to ")[0];
              const is_from_me = sender_name === userData.sdr_name;

              // console.log("parsed message is", parsedMessage);
              return {
                ...message,
                type: "slack",
                hidden_until: message.hidden_until,
                role: is_from_me ? "user" : "assistant",
                sender_name,
                slack_channel: parsedMessage.title
                  .split(" sent to ")[1]
                  .split(" at ")[0],
                message: parsedMessage.data,
                title: parsedMessage.title,
                timestamp: parsedMessage.timestamp,
              };
            } catch (error) {
              console.error("Error parsing SLACK MESSAGE:", error);
              return message;
            }
          }
          return message;
        }
      );
      setMessages(transformedMessages);

      const memory: MemoryType | undefined = currentThread?.memory;
      console.log("current thread is", currentThread);
      if (currentThread?.tasks) {
        const orderedTasks = currentThread.tasks.sort(
          (a, b) => a.order_number - b.order_number
        );
        setTasks(orderedTasks || []);
      }
      if (memory) {
        setAIType(tab_override || memory.tab || "PLANNER");
      } else {
        setAIType("PLANNER");
      }

      console.log("Messages data:", messages);
      // You can add further processing of the messages here if needed
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingNewChat(false);
    }
  };

  const handleCreateNewSession = async () => {
    setLoadingNewChat(true);
    try {
      const room_id = Array.from(
        { length: 16 },
        () => Math.random().toString(36)[2]
      ).join("");
      roomIDref.current = room_id;
      socket.emit("join-room", {
        payload: { room_id: room_id },
      });

      const response = await fetch(`${API_URL}/selix/create_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          additional_context: "",
          room_id: room_id,
          device_id: deviceIDRef.current,
        }), // Placeholder for the body
      });
      const data = await response;
      console.log("data is", data);
    } catch (error) {
      console.error("Error creating new session:", error);
    } finally {
      setLoadingNewChat(false);
    }
  };

  const userData = useRecoilValue(userDataState);
  const userToken = useRecoilValue(userTokenState);

  const handleNewMessage = (data: {
    message?: string;
    action?: any;
    device_id?: string;
    role: "user" | "assistant" | "system";
    thread_id: string;
  }) => {
    console.log("new message is", data);
    // if the message is not for the current device, ignore it
    if (data?.device_id === deviceIDRef.current) {
      return;
    }
    if (data.thread_id === roomIDref.current) {
      if (data.message) {
        let newMessage: MessageType = {
          created_time: moment().format("MMMM D, h:mm a"),
          message: data?.message || "",
          role: data?.role || "assistant",
          type: "message",
        };

        // Handle slack message
        if (
          data.message.includes("SLACK MESSAGE") ||
          data.message.includes("SUPPORT THREAD SLACK")
        ) {
          try {
            const parsedMessage = JSON.parse(data.message);
            const sender_name = parsedMessage.title.split(" sent to ")[0];
            const is_from_me = sender_name === userData.sdr_name;

            newMessage = {
              ...newMessage,
              type: "slack",
              role: is_from_me ? "user" : "assistant",
              sender_name,
              slack_channel: parsedMessage.title
                .split(" sent to ")[1]
                .split(" at ")[0],
              message: parsedMessage.data,
              // title: parsedMessage.title,
              created_time: parsedMessage.timestamp,
            };
          } catch (error) {
            console.error("Error parsing SLACK MESSAGE:", error);
          }
        }

        setMessages((chatContent: MessageType[]) => [
          ...chatContent,
          newMessage,
        ]);

        if (data.role === "assistant") {
          setMessages((chatContent: MessageType[]) =>
            chatContent.filter((message) => message.message !== "loading")
          );
        }
      } else if (data.action) {
        setMessages((chatContent: MessageType[]) => [
          ...chatContent,
          {
            created_time: moment().format("MMMM D, h:mm a"),
            message: data.action.action_description,
            role: "assistant",
            type: "action",
            action_title: data.action.action_title,
            action_description: data.action.action_description,
            action_function: data.action.action_function,
            action_params: data.action.action_params,
          },
        ]);
      }
    }

    //remove all messages that are message.message === 'loading'
  };

  const handleChangeTab = (data: { tab: string; thread_id: string }) => {
    if (data.thread_id === roomIDref.current) {
      //re-render hack
      if (data.tab === "ASSETS") {
        const randomInt = Math.floor(Math.random() * 100);
        setRefreshAssetLibrary(randomInt);
      }
      if (data.tab === "ICP") {
        setAIType("");
        setTimeout(() => setAIType("ICP"), 0);
      } else {
        setAIType(data.tab);
      }
    }
  };

  const handleUpdateTranscript = (data: {
    message: string;
    device_id: string;
    original_sentnece: string;
  }) => {
    console.log(
      "comparing promps: ",
      promptRef.current,
      data.original_sentnece
    );
    if (
      data.device_id === deviceIDRef.current &&
      promptRef.current === data.original_sentnece
    ) {
      setPrompt(data.message);
      promptRef.current = data.message;
      promptLengthRef.current = data.message.length;
    }
  };

  const handleAddTaskToSession = async (data: {
    task: TaskType;
    thread_id: string;
  }) => {
    if (data.thread_id === roomIDref.current) {
      console.log("adding task to session", data);

      const task = data.task;

      showNotification({
        title: "Task added",
        message: `Task: ${task.title} has been added`,
        color: "green",
        icon: <IconCircleCheck />,
      });

      console.log("task is", task);
      // Ensure the task is added correctly to the current session
      setThreads((prevThreads) => {
        const updatedThreads = prevThreads.map((thread) => {
          if (thread.id === sessionIDRef.current) {
            const updatedTasks = Array.isArray(thread.tasks)
              ? thread.tasks.map((t) => (t.id === task.id ? task : t))
              : [task];
            if (!updatedTasks.some((t) => t.id === task.id)) {
              updatedTasks.push(task);
            }
            return { ...thread, tasks: updatedTasks };
          } else {
            console.log(
              "found no match for the current session. we compared",
              task.selix_session_id,
              "and",
              sessionIDRef.current
            );
          }
          return thread;
        });

        // Ensure the updated threads object is correctly reflected for children components
        const currentThread = updatedThreads.find(
          (thread) => thread.id === sessionIDRef.current
        );
        const orderedTasks = currentThread?.tasks?.sort(
          (a, b) => a.order_number - b.order_number
        );
        setTasks(orderedTasks || []);

        return updatedThreads;
      });
    }
  };

  const handleNewSession = async (data: {
    session: ThreadType;
    thread_id: string;
  }) => {
    //only create new sessions if they were meant for the current user
    if (data.session.client_sdr_id !== userData.id) {
      return;
    }
    // if (data.thread_id === roomIDref.current) {
    // just update the local state
    setThreads((prevThreads) => [...prevThreads, data.session]);
    getMessages(data.session.thread_id, data.session.id);
    setCurrentSessionId(data.session.id);
    console.log("meowww", data.session.id);
    sessionIDRef.current = data.session.id;
    roomIDref.current = data.session.thread_id;

    showNotification({
      title: "New Session",
      message: `New session created: ${data.session.session_name}`,
      color: "blue",
      icon: <IconEye />,
    });
    // }
  };

  const addActionToSession = (data: {
    action: MessageType;
    thread_id: string;
  }) => {
    queryClient.invalidateQueries(["selix_event_logs"]);
    console.log("adding action to session", data);
    if (data.thread_id === roomIDref.current) {
      setMessages((chatContent: MessageType[]) => [
        ...chatContent,
        {
          ...data.action,
        } as MessageType,
      ]);

      showNotification({
        title: "Action added",
        message: `Action: ${data.action?.action_title} has been added`,
        color: "green",
        icon: <IconCircleCheck />,
      });
    }
  };

  const queryClient = useQueryClient();

  const handleUpdateTaskAndAction = (
    data: {
      task: TaskType;
      action?: MessageType;
      thread_id: string;
    },
    setMessages: any
  ) => {
    queryClient.invalidateQueries(["selix_event_logs"]);
    if (data.thread_id === roomIDref.current) {
      // Update the task
      if (data.task) {
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            data.task.selix_session_id === sessionIDRef.current
              ? {
                  ...thread,
                  tasks: Array.isArray(thread.tasks)
                    ? thread.tasks.map((task) =>
                        task.id === data.task.id ? data.task : task
                      )
                    : [data.task],
                }
              : thread
          )
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === data.task.id ? data.task : task))
        );
      }

      // Update the action
      if (data.action) {
        setMessages((prevMessages: MessageType[]) =>
          prevMessages.map((message) =>
            message?.id === data.action?.id
              ? (data.action as MessageType)
              : message
          )
        );
      }

      // Force update the tasks
      setCounter((prev) => prev + 1);
    }
  };

  const handleUpdateSession = async (data: {
    session: ThreadType;
    thread_id: string;
  }) => {
    if (roomIDref.current === data.thread_id) {
      // showNotification({
      //   key: "session_updated",
      //   title: "Session updated",
      //   message: `Session: ${data.session.session_name} has been updated`,
      //   color: "green",
      //   icon: <IconCircleCheck />,
      // });

      // just update the local state
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === sessionIDRef.current
            ? { ...thread, ...data.session }
            : thread
        )
      );
    }
  };

  const handleIncrementCounter = async (data: { thread_id: string }) => {
    if (data.thread_id === roomIDref.current) {
      console.log("heyyy counter");
      setCounter((prev) => counter + 1);
    }
  };

  //controls the sliding up and down of the suggestion
  const slideUp = () => {
    setSuggestionHidden(false);
    const div = document.getElementById("slidingDiv");
    if (div) {
      div.style.animation = "slideUp 0.5s forwards";
    }
  };
  const slideDown = () => {
    const div = document.getElementById("slidingDiv");
    if (div) {
      div.style.animation = "slideDown 0.5s forwards";
    }
  };
  const handleSuggestion = async (data: {
    message: string;
    thread_id: string;
    device_id: string;
  }) => {
    //only show the suggestion if the message is for the current device
    if (
      data.thread_id === roomIDref.current &&
      data.device_id === deviceIDRef.current
    ) {
      const currentTime = Date.now();
      setSuggestion(data.message);

      // queue the next slide up if the last slide up was less than 6 seconds ago
      if (currentTime - prevSlideUpTime.current < 6000) {
        setTimeout(() => {
          slideUp();
          prevSlideUpTime.current = Date.now(); // Update the time start ref after sliding up
        }, 6000 - (currentTime - prevSlideUpTime.current));
      } else {
        slideUp();
        prevSlideUpTime.current = currentTime; // Set the time start ref of this suggestion
      }

      // slide down after 6 seconds no matter what
      setTimeout(() => {
        slideDown();
      }, 6000);
    }
  };

  useEffect(() => {
    socket.on("incoming-message", handleNewMessage);
    socket.on("change-tab", handleChangeTab);
    socket.on("add-task-to-session", handleAddTaskToSession);
    socket.on("add-action-to-session", addActionToSession);
    socket.on("new-session", handleNewSession);
    socket.on("update-action", (data) => {
      handleUpdateTaskAndAction(data, setMessages);
    });
    socket.on("corrected-transcript", handleUpdateTranscript);
    socket.on("update-session", handleUpdateSession);
    socket.on("increment-counter", handleIncrementCounter);
    socket.on("suggestion", handleSuggestion);
    socket.on("update-task", (data) => {
      handleUpdateTaskAndAction(data, setMessages);
    });
    socket.on("first-message-suggestion", (data) => {
      console.log("data is", data);
      setSuggestedFirstMessage(data.messages);
    });
    return () => {
      socket.off("incoming-message", handleNewMessage);
      socket.off("change-tab", handleChangeTab);
      socket.off("add-task-to-session", handleAddTaskToSession);
      socket.off("add-action-to-session", addActionToSession);
      socket.off("new-session", handleNewSession);
      socket.off("update-action", (data) => {
        handleUpdateTaskAndAction(data, setMessages);
      });
      socket.off("update-task", (data) => {
        handleUpdateTaskAndAction(data, setMessages);
      });
      socket.off("corrected-transcript", handleUpdateTranscript);
      socket.off("update-session", handleUpdateSession);
      socket.off("increment-counter", handleIncrementCounter);
      socket.off("suggestion", handleSuggestion);
      socket.off("first-message-suggestion", (data) => {
        setSuggestedFirstMessage(data.messages);
      });
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (recording) {
      intervalId = setInterval(() => {
        const memory = threads.find(
          (thread) => thread.id === currentSessionId
        )?.memory;
        if (
          memory?.strategy_id &&
          promptLengthRef.current > prevPromptLengthRef.current + 80
        ) {
          handleEditStrategy(promptRef.current);
          prevPromptLengthRef.current = promptLengthRef.current;
        }
      }, 3000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [recording]);

  useEffect(() => {
    const fetchAndLoadMessages = async () => {
      const threads_loaded = await fetchChatHistory();
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get("session_id");
      // const threadIdFromUrl = urlParams.get("thread_id");
      console.log("session id from url is", sessionIdFromUrl);
      console.log("got here");
      if (sessionIdFromUrl) {
        // Preserve the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("session_id", sessionIdFromUrl);
        // if (threadIdFromUrl) {
        //   urlParams.set("thread_id", threadIdFromUrl);
        // }
        const threadId = threads_loaded.find(
          (thread: ThreadType) => thread.id === Number(sessionIdFromUrl)
        )?.thread_id;
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, document.title, newUrl);
        getMessages(
          threadId || "",
          parseInt(sessionIdFromUrl),
          threads_loaded,
          "PLANNER"
        );
        setCurrentSessionId(Number(sessionIdFromUrl));
        // console.log("meowww", data.session.id);
        sessionIDRef.current = Number(sessionIdFromUrl);
        roomIDref.current = threadId || "";
        const currentThread = threads_loaded.find(
          (thread: ThreadType) => thread.id === Number(sessionIdFromUrl)
        );
        const orderedTasks = currentThread?.tasks?.sort(
          (a: TaskType, b: TaskType) => a.order_number - b.order_number
        );
        setTasks(orderedTasks || []);
        setAIType("PLANNER");
      }
    };

    fetchAndLoadMessages();
  }, [userToken]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    promptLengthRef.current = prompt.length;
    if (prompt.trim().length === 0) {
      prevPromptLengthRef.current = 0;
    }
    const handlePromptChange = async () => {
      try {
        const response = await fetch(`${API_URL}/selix/generate_followup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            messages: messages,
            room_id: roomIDref.current,
            device_id: deviceIDRef.current,
            previous_follow_up: suggestion,
          }),
        });

        const data = await response.json();
        // Log the generated follow-up question
        console.log("Follow-up question generated:", data);
      } catch (error) {
        console.error("Error generating follow-up question:", error);
      }
    };

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (prompt.trim().length > 0) {
        handlePromptChange();
      }
    }, 3000); // Adjust the debounce delay as needed

    // Reset the timer to ensure it makes requests again
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [prompt]);

  const [segment, setSegment] = useState([]);
  const [opened, { toggle }] = useDisclosure(true);

  const [aiType, setAIType] = useState("task");

  const [openedChat, setOpened] = useState(false);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [intendedTaskChange, setIntendedTaskChange] = useState<
    | "ACTIVE"
    | "COMPLETE"
    | "CANCELLED"
    | "PENDING_OPERATOR"
    | "BLOCKED"
    | "IN_PROGRESS"
    | undefined
  >(undefined);

  const containerRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - (containerRef.current?.offsetLeft || 0);
      scrollLeft = containerRef.current?.scrollLeft || 0;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - (containerRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 3; // scroll-fast
      if (containerRef.current) {
        containerRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const container = containerRef.current;

    container?.addEventListener("mousedown", handleMouseDown);
    container?.addEventListener("mouseleave", handleMouseLeave);
    container?.addEventListener("mouseup", handleMouseUp);
    container?.addEventListener("mousemove", handleMouseMove);

    return () => {
      container?.removeEventListener("mousedown", handleMouseDown);
      container?.removeEventListener("mouseleave", handleMouseLeave);
      container?.removeEventListener("mouseup", handleMouseUp);
      container?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const [type, setType] = useState("active");
  const [hoverChat, setHoverChat] = useState<number>();
  const [newButtonHover, setNewButtonHover] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);

  const [activeOpened, { toggle: ActiveToggle }] = useDisclosure(true);
  const [needOpened, { toggle: NeedToggle }] = useDisclosure(true);
  const [completedOpened, { toggle: CompleteToggle }] = useDisclosure(false);

  const supervisor_thread = threads.find(
    (thread) => thread.is_supervisor_session
  );
  const [supervisorMemoryLine, setSupervisorMemoryLine] = useState<
    string | undefined
  >(
    threads.find((thread) => thread.is_supervisor_session)?.memory?.memory_line
  );

  const [memoryPopupOpen, setMemoryPopupOpen] = useState(false);
  const [fetchingMemoryState, setFetchingMemoryState] = useState(false);
  const [openEventLogs, setOpenEventLogs] = useState(false);
  const [memoryLineEditMode, setMemoryLineEditMode] = useState(false);

  const [memoryStateChanged, setMemoryStateChanged] = useState(false);
  const [memoryLineHoverData, setMemoryLineHoverData]: any = useState<
    string | null
  >();

  const [generatingNewMemoryLine, setGeneratingNewMemoryLine] = useState(false);

  const [supervisorMemoryState, setSupervisorMemoryState] = useState<any>(
    threads.find((thread) => thread.is_supervisor_session)?.memory.memory_state
  );

  const [showMemoryForKey, setShowMemoryForKey] = useState("");

  const addMemory = async (
    memoryTitle: string,
    memoryContent: string,
    requiresUserInput: boolean = false
  ) => {
    try {
      const response = await fetch(`${API_URL}/selix/add_memory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          selix_session_id: sessionIDRef.current as number,
          memory_title: memoryTitle,
          memory_content: memoryContent,
          requires_user_input: requiresUserInput,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification({
          title: "Memory Added",
          message: "Memory added successfully",
          color: "green",
          icon: <IconCircleCheck />,
        });
      } else {
        showNotification({
          title: "Error Adding Memory",
          message: result.message || "Failed to add memory",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      console.error("Error adding memory:", error);
    } finally {
      getMemoryState(sessionIDRef.current as number);
    }
  };

  const getMemoryState = async (sessionId: number) => {
    setFetchingMemoryState(true);
    try {
      const response = await fetch(
        `${API_URL}/selix/get_memory_state?session_id=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSupervisorMemoryState(result.memory_state);
      } else {
        showNotification({
          title: "Error Fetching Memory State",
          message: result.message || "Failed to fetch memory state",
          color: "red",
          icon: <IconX />,
        });
        return null;
      }
    } catch (error) {
      console.error("Error fetching memory state:", error);
      return null;
    } finally {
      setFetchingMemoryState(false);
    }
  };

  const generateNewDraftMemoryLine = async () => {
    setGeneratingNewMemoryLine(true);
    try {
      const response = await fetch(
        `${API_URL}/selix/generate_new_draft_memory_line`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const result = await response.json();
      const memory_line = result.memory_line;

      setSupervisorMemoryLine(memory_line);
      setMemoryStateChanged(true);
      setClientMemoryStateUpdatedTime(new Date().toLocaleString());
      getMemoryState(sessionIDRef.current as number);

      if (response.ok) {
        showNotification({
          title: "New Draft Memory Line Generated",
          message: "Save the new memory line to all sessions",
          color: "blue",
          icon: <IconCircleCheck />,
        });
      } else {
        showNotification({
          title: "Error Generating New Draft Memory Line",
          message: result.error || "Failed to generate new draft memory line",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      console.error("Error generating new draft memory line:", error);
    } finally {
      setGeneratingNewMemoryLine(false);
    }
  };

  const createSelixSupervisorLog = async () => {
    try {
      setGeneratingNewMemoryLine(true);
      const response = await fetch(`${API_URL}/selix/add_supervisor_log`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create log");
      }

      const result = await response.json();
      console.log("Log created successfully:", result);
    } catch (error) {
      console.error("Error creating log:", error);
    } finally {
      setGeneratingNewMemoryLine(false);
    }
  };

  const changeMemoryStatus = async (memoryId: number, status: string) => {
    try {
      const response = await fetch(`${API_URL}/selix/change_memory_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          memory_id: memoryId,
          new_status: status,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification({
          title: "Memory Status Changed",
          message: result.message,
          color: "green",
          icon: <IconCircleCheck />,
        });
      } else {
        showNotification({
          title: "Error Changing Memory Status",
          message: result.error || "Failed to change memory status",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      console.error("Error changing memory status:", error);
    } finally {
      getMemoryState(sessionIDRef.current as number);
    }
  };

  const updateMemoryLineAllSessions = async (
    newMemoryLine: string | undefined
  ) => {
    if (!newMemoryLine) {
      return;
    }
    setMemoryLineUpdating(true);
    try {
      const response = await fetch(
        `${API_URL}/selix/update_memory_line_all_sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            new_memory_line: newMemoryLine,
            session_id: sessionIDRef.current as number,
          }),
        }
      );

      const result = await response.json();

      await createSelixSupervisorLog();

      if (response.ok) {
        showNotification({
          title: "Memory Line Updated",
          message: result.message,
          color: "green",
          icon: <IconCircleCheck />,
        });
      } else {
        showNotification({
          title: "Error Updating Memory Line",
          message: result.error || "Failed to update memory line",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      console.error("Error updating memory line:", error);
    } finally {
      setMemoryLineUpdating(false);
    }
  };

  const hoverHandler = (session: any) => {
    setMemoryLineHoverData(session.memory);
  };

  useEffect(() => {
    const handleSpanHover = (event: any) => {
      if (event.target && event.target.dataset.title) {
        const session = supervisorMemoryState?.sessions.find(
          (s: any) =>
            s.title === event.target.dataset.title ||
            "@" + s.title === event.target.dataset.title
        );
        if (session) {
          hoverHandler(session);
        }
      }
    };

    const handleSpanMouseLeave = (event: any) => {
      if (event.target && event.target.dataset.title) {
        setMemoryLineHoverData(null);
      }
    };

    document.addEventListener("mouseover", handleSpanHover);
    document.addEventListener("mouseout", handleSpanMouseLeave);

    return () => {
      document.removeEventListener("mouseover", handleSpanHover);
      document.removeEventListener("mouseout", handleSpanMouseLeave);
    };
  }, [supervisorMemoryState?.sessions]);

  const [newMemoryTitle, setNewMemoryTitle] = useState("");
  const [showAddMemoryInput, setShowAddMemoryInput] = useState(false);

  const selixMemoryTitleTranslations: { [key: string]: string } = {
    campaigns: "Currently working on: ",
    sessions: "Currently working on: ",
    needs_user_input: "Need your input: ",
    needs_ai_input: "Other to-do's: ",
  };

  const [memoryLineUpdating, setMemoryLineUpdating] = useState(false);

  const memory = threads.find(
    (thread) => thread.id === sessionIDRef.current
  )?.memory;

  const supervisorMemory = threads.find(
    (thread) => thread.is_supervisor_session
  )?.memory;

  const [clientMemoryStateUpdatedTime, setClientMemoryStateUpdatedTime] =
    useState<any>(memory?.memory_line_time_updated);

  return (
    <>
      <DropzoneWrapper
        setPrompt={setPrompt}
        prompt={prompt}
        setAttachedFile={setAttachedFile}
        ref={dropzoneRef}
        handleSubmit={handleSubmit}
      >
        <Card maw={"100%"} style={{ backgroundColor: "transparent" }} p={0}>
          {currentSessionId && (
            <Flex gap={"xl"}>
              {window.location.hostname !== "localhost" && (
                <LoadingOverlay visible={loadingNewChat} />
              )}

              <Paper withBorder w={showSidebar ? "30%" : "5%"} h={"100%"}>
                <Flex
                  align={"center"}
                  justify={showSidebar ? "space-between" : "center"}
                  p={"sm"}
                >
                  {showSidebar && (
                    <Text fw={500} size={"lg"}>
                      Sessions
                    </Text>
                  )}
                  <Flex align={"center"} gap={"8px"}>
                    <Popover
                      width={360}
                      shadow="md"
                      position="left"
                      withinPortal
                      opened={memoryPopupOpen}
                      onClose={() => setMemoryPopupOpen(false)}
                      closeOnClickOutside={false}
                    >
                      <Popover.Target>
                        <Text
                          ml={"auto"}
                          size={"xs"}
                          color="gray"
                          sx={{ pointer: "cursor" }}
                          onClick={() => setMemoryPopupOpen((prev) => !prev)}
                        >
                          <Badge color="pink" variant="outline">
                            👤
                          </Badge>
                        </Text>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Flex justify="space-between" align="center" mb="xs">
                          <LoadingOverlay visible={fetchingMemoryState} />
                          <Title order={5}>🧑 Supervisor Memory</Title>

                          {supervisorMemory?.session_mode && (
                            <Tooltip
                              label={
                                "Current Goal: " +
                                supervisorMemory.session_current_goal
                              }
                              withArrow
                            >
                              <Badge
                                color="gray"
                                variant="outline"
                                radius={4}
                                ml="auto"
                              >
                                🧑{" "}
                                {supervisorMemory.session_mode?.replace(
                                  "_",
                                  " "
                                )}
                              </Badge>
                            </Tooltip>
                          )}

                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            onClick={() => setMemoryPopupOpen(false)}
                            ml="auto"
                          >
                            x
                          </Button>
                        </Flex>
                        <Card
                          withBorder
                          mah={700}
                          p="md"
                          sx={{ overflow: "auto" }}
                        >
                          <Flex>
                            <Text size="sm" color="gray" fw="500">
                              Currently working on:
                            </Text>
                            <Button
                              onClick={() => {
                                setMemoryPopupOpen(false);
                                setOpenEventLogs(true);
                              }}
                              size="xs"
                              color="teal"
                              ml="auto"
                              variant="outline"
                              pt="2px"
                              pb="2px"
                              mb="4px"
                              leftIcon={<IconHistory size={16} />}
                            >
                              Event Logs
                            </Button>
                          </Flex>

                          {memoryLineEditMode ? (
                            <Textarea
                              placeholder="Type your notes here..."
                              autosize
                              minRows={3}
                              value={supervisorMemoryLine}
                              onChange={(e) => {
                                setSupervisorMemoryLine(e.target.value);
                                setMemoryStateChanged(true);
                              }}
                              size="xs"
                              mb="0px"
                            />
                          ) : (
                            <HoverCard
                              position="right"
                              width={200}
                              shadow="md"
                              withinPortal
                            >
                              <HoverCard.Target>
                                <Text
                                  size="xs"
                                  p="xs"
                                  onClick={() => {
                                    setMemoryLineEditMode(true);
                                    setMemoryStateChanged(true);
                                  }}
                                  sx={{ cursor: "pointer" }}
                                  dangerouslySetInnerHTML={{
                                    __html: (
                                      supervisorMemoryLine ||
                                      "Click to add notes..."
                                    )?.replace(/\n/g, "<br>"),
                                  }}
                                />
                              </HoverCard.Target>
                              <HoverCard.Dropdown
                                miw={memoryLineHoverData ? 500 : 0}
                                display={memoryLineHoverData ? "block" : "none"}
                              >
                                <Text
                                  size="xs"
                                  dangerouslySetInnerHTML={{
                                    __html: memoryLineHoverData,
                                  }}
                                />
                              </HoverCard.Dropdown>
                            </HoverCard>
                          )}

                          <Text
                            align="right"
                            size="12px"
                            color="gray"
                            mt="2px"
                            ml="auto"
                          >
                            Last updated:{" "}
                            {supervisorMemory?.memory_line_time_updated
                              ? moment
                                  .utc(
                                    supervisorMemory?.memory_line_time_updated
                                  )
                                  .local()
                                  .fromNow()
                              : "N/A"}
                          </Text>
                          <Flex mt="4px" mb="md">
                            <Tooltip
                              label="Rewind to previous version"
                              withArrow
                            >
                              <Button
                                color="gray"
                                size="xs"
                                opacity={
                                  !supervisorMemory?.old_memory_line ? 0.5 : 1
                                }
                                disabled={!supervisorMemory?.old_memory_line}
                                onClick={() => {
                                  setSupervisorMemoryLine(
                                    supervisorMemory?.old_memory_line
                                  );
                                  setClientMemoryStateUpdatedTime(
                                    supervisorMemory?.old_memory_line_time_updated
                                  );
                                  setMemoryStateChanged(true);
                                }}
                              >
                                ⏮
                              </Button>
                            </Tooltip>
                            <Tooltip
                              label="Generate a new memory line"
                              withArrow
                            >
                              <Button
                                color="yellow"
                                size="xs"
                                ml="4px"
                                loading={generatingNewMemoryLine}
                                onClick={() => generateNewDraftMemoryLine()}
                              >
                                ♺
                              </Button>
                            </Tooltip>
                            <Flex
                              ml="auto"
                              justify="flex-end"
                              style={{
                                display:
                                  memoryStateChanged || memoryLineUpdating
                                    ? "flex"
                                    : "none",
                              }}
                            >
                              {memoryLineUpdating && (
                                <Flex mr="md" mt="4px">
                                  <Loader size="sm"></Loader>
                                </Flex>
                              )}
                              <Button
                                size="xs"
                                color="green"
                                disabled={
                                  !memoryStateChanged || memoryLineUpdating
                                }
                                onClick={() => {
                                  updateMemoryLineAllSessions(
                                    supervisorMemoryLine
                                  );
                                  setClientMemoryStateUpdatedTime(
                                    new Date().toLocaleString()
                                  );
                                  setMemoryStateChanged(false);
                                  setMemoryLineEditMode(false);
                                }}
                              >
                                ✓
                              </Button>
                              <Button
                                size="xs"
                                color="red"
                                disabled={
                                  !memoryStateChanged || memoryLineUpdating
                                }
                                ml="xs"
                                onClick={() => {
                                  setSupervisorMemoryLine(
                                    supervisorMemory?.memory_line
                                  );
                                  setClientMemoryStateUpdatedTime(
                                    supervisorMemory?.memory_line_time_updated
                                  );
                                  setMemoryStateChanged(false);
                                  setMemoryLineEditMode(false);
                                }}
                              >
                                ��
                              </Button>
                            </Flex>
                          </Flex>

                          {supervisorMemoryState &&
                            [
                              "campaigns",
                              "sessions",
                              ...Object.keys(supervisorMemoryState).filter(
                                (x) => x !== "campaigns" && x !== "sessions"
                              ),
                            ].map((x: string) => {
                              return (
                                <Box mb="md">
                                  {x !== "campaigns" && x !== "sessions" && (
                                    <Divider mb="md" />
                                  )}
                                  {x !== "campaigns" && x !== "sessions" && (
                                    <Text size="sm" color="gray" fw="500">
                                      {selixMemoryTitleTranslations[x]}
                                    </Text>
                                  )}

                                  {Array.isArray(supervisorMemoryState[x]) &&
                                    supervisorMemoryState[x]
                                      .filter(
                                        (y: any) =>
                                          !supervisorMemoryLine?.includes(
                                            y.title
                                          )
                                      )
                                      .map((y: any) => (
                                        <>
                                          <Box id={`memory-${y.memory}`}>
                                            <HoverCard
                                              width={500}
                                              shadow="md"
                                              withinPortal
                                              position="right"
                                            >
                                              <HoverCard.Target>
                                                <Flex>
                                                  <Box
                                                    ml="4px"
                                                    sx={{
                                                      border: "1px solid",
                                                      borderColor: "gray",
                                                      borderRadius: "8px",
                                                      position: "relative",
                                                      display: "inline-block",
                                                      cursor: "pointer",
                                                      fontSize: "10px",
                                                      padding: "2px",
                                                      marginBottom: "4px",
                                                      marginRight: "4px",
                                                      paddingLeft: "8px",
                                                      paddingRight: "8px",
                                                      paddingTop: "2px",
                                                      paddingBottom: "2px",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      const target: any =
                                                        e.currentTarget;
                                                      if (
                                                        x === "campaigns" ||
                                                        x === "sessions"
                                                      ) {
                                                        return;
                                                      }
                                                      target.querySelector(
                                                        ".hover-icons"
                                                      )!.style.display = "flex";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      const target: any =
                                                        e.currentTarget;
                                                      if (
                                                        x === "campaigns" ||
                                                        x === "sessions"
                                                      ) {
                                                        return;
                                                      }
                                                      target.querySelector(
                                                        ".hover-icons"
                                                      )!.style.display = "none";
                                                    }}
                                                  >
                                                    <Text
                                                      p="0"
                                                      m="0"
                                                      size="xs"
                                                      color="black"
                                                    >
                                                      {y["title"].substring(
                                                        0,
                                                        36
                                                      ) +
                                                        (y["title"].length > 36
                                                          ? "..."
                                                          : "")}
                                                    </Text>
                                                    <Flex
                                                      className="hover-icons"
                                                      sx={{
                                                        display: "none",
                                                        position: "absolute",
                                                        top: "4px",
                                                        right: "4px",
                                                        gap: "4px",
                                                        backgroundColor:
                                                          "white",
                                                      }}
                                                    >
                                                      <Tooltip
                                                        label="Mark as Cancelled"
                                                        withArrow
                                                      >
                                                        <ActionIcon
                                                          size="xs"
                                                          color="red"
                                                          onClick={() => {
                                                            const id = y.id;
                                                            changeMemoryStatus(
                                                              id,
                                                              "CANCELLED"
                                                            );
                                                          }}
                                                        >
                                                          <IconX size={12} />
                                                        </ActionIcon>
                                                      </Tooltip>
                                                      <Tooltip
                                                        label="Mark as Complete"
                                                        withArrow
                                                      >
                                                        <ActionIcon
                                                          size="xs"
                                                          color="green"
                                                          onClick={() => {
                                                            const id = y.id;
                                                            changeMemoryStatus(
                                                              id,
                                                              "COMPLETE"
                                                            );
                                                          }}
                                                        >
                                                          <IconCheck
                                                            size={12}
                                                          />
                                                        </ActionIcon>
                                                      </Tooltip>
                                                    </Flex>
                                                  </Box>
                                                  {(x === "campaigns" ||
                                                    x === "sessions") && (
                                                    <Box ml="4px" pt="2px">
                                                      <IconCloud
                                                        size="0.9rem"
                                                        color="gray"
                                                      />
                                                    </Box>
                                                  )}
                                                </Flex>
                                              </HoverCard.Target>
                                              <HoverCard.Dropdown maw={500}>
                                                <Text
                                                  size="xs"
                                                  color="black"
                                                  fw={400}
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      y["memory"] &&
                                                      y["memory"].replaceAll(
                                                        "\n",
                                                        "<br>"
                                                      ),
                                                  }}
                                                />
                                              </HoverCard.Dropdown>
                                            </HoverCard>
                                          </Box>
                                        </>
                                      ))}

                                  <Box mt="sm">
                                    {(x == "needs_user_input" ||
                                      x == "needs_ai_input") && (
                                      <>
                                        {!showAddMemoryInput && (
                                          <Button
                                            variant="outline"
                                            ml="auto"
                                            size="xs"
                                            color="gray"
                                            onClick={() => {
                                              if (showAddMemoryInput) {
                                                setShowAddMemoryInput(false);
                                                setShowMemoryForKey("");
                                              } else {
                                                setShowAddMemoryInput(true);
                                                setShowMemoryForKey(x);
                                              }
                                            }}
                                          >
                                            +
                                          </Button>
                                        )}
                                        {showAddMemoryInput &&
                                          showMemoryForKey === x && (
                                            <Flex mt="xs" align="center">
                                              <TextInput
                                                placeholder="Enter memory title"
                                                value={newMemoryTitle}
                                                onChange={(event) =>
                                                  setNewMemoryTitle(
                                                    event.currentTarget.value
                                                  )
                                                }
                                                onKeyDown={(event) => {
                                                  if (event.key === "Enter") {
                                                    addMemory(
                                                      newMemoryTitle,
                                                      newMemoryTitle,
                                                      x == "needs_user_input"
                                                        ? true
                                                        : false
                                                    );
                                                    setNewMemoryTitle("");
                                                    setShowAddMemoryInput(
                                                      false
                                                    );
                                                  }
                                                }}
                                                width="100%"
                                                mr="xs"
                                              />
                                              <Button
                                                size="xs"
                                                color="green"
                                                onClick={() => {
                                                  addMemory(
                                                    newMemoryTitle,
                                                    newMemoryTitle,
                                                    x == "needs_user_input"
                                                      ? true
                                                      : false
                                                  );
                                                  setNewMemoryTitle("");
                                                  setShowAddMemoryInput(false);
                                                }}
                                              >
                                                Add
                                              </Button>
                                              <Button
                                                size="xs"
                                                color="red"
                                                onClick={() => {
                                                  setNewMemoryTitle("");
                                                  setShowAddMemoryInput(false);
                                                }}
                                                ml="xs"
                                              >
                                                Cancel
                                              </Button>
                                            </Flex>
                                          )}
                                      </>
                                    )}
                                  </Box>
                                </Box>
                              );
                            })}
                        </Card>
                      </Popover.Dropdown>
                    </Popover>
                    <ActionIcon onClick={() => setShowSidebar(!showSidebar)}>
                      {showSidebar ? (
                        <IconChevronLeft size={"1rem"} />
                      ) : (
                        <IconChevronRight size={"1rem"} />
                      )}
                    </ActionIcon>
                  </Flex>
                </Flex>
                <Divider />
                <Box p={"sm"}>
                  {showSidebar ? (
                    <Button
                      leftIcon={<IconPlus color={"white"} size={"1.3rem"} />}
                      // className="bg-[#D444F1]/10 hover:bg-[#D444F1]/80 text-[#D444F1] hover:text-white"
                      onClick={
                        !loadingNewChat
                          ? () => handleCreateNewSession()
                          : undefined
                      }
                      loading={loadingNewChat}
                      onMouseEnter={() => setNewButtonHover(true)}
                      onMouseLeave={() => setNewButtonHover(false)}
                      fullWidth
                      color="grape"
                    >
                      New Chat
                    </Button>
                  ) : (
                    <ActionIcon
                      variant="filled"
                      color="grape"
                      size={"lg"}
                      onClick={
                        !loadingNewChat
                          ? () => handleCreateNewSession()
                          : undefined
                      }
                      loading={loadingNewChat}
                      onMouseEnter={() => setNewButtonHover(true)}
                      onMouseLeave={() => setNewButtonHover(false)}
                    >
                      <IconPlus size={"1.3rem"} color="white" />
                    </ActionIcon>
                  )}

                  <ScrollArea h={770} offsetScrollbars>
                    {showSidebar && (
                      <>
                        <Stack spacing={"xs"} mt={"xl"}>
                          <Stack spacing={"xs"}>
                            {supervisor_thread && (
                              <Paper
                                withBorder
                                radius={"sm"}
                                p={"sm"}
                                w={"100%"}
                                style={{
                                  // cursor: "grab",
                                  display: "inline-block",
                                  // minWidth: "350px",
                                  backgroundColor:
                                    sessionIDRef.current ===
                                    supervisor_thread.id
                                      ? "#d0f0c0"
                                      : "white", // Highlight if current thread
                                  borderColor:
                                    sessionIDRef.current ===
                                    supervisor_thread.id
                                      ? "#00796b"
                                      : "#e6ebf0", // Change border color if current thread
                                }}
                                className={`transition duration-300 ease-in-out transform ${
                                  sessionIDRef.current === supervisor_thread.id
                                    ? "scale-105 shadow-2xl"
                                    : "hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:border-[1px] hover:!border-[#228be6] hover:!bg-[#228be6]/5"
                                }`}
                                onClick={() => {
                                  getMessages(
                                    supervisor_thread.thread_id,
                                    supervisor_thread.id
                                  );
                                  toggle();
                                }}
                                onMouseEnter={() =>
                                  setHoverChat(supervisor_thread.id)
                                }
                                onMouseLeave={() => setHoverChat(undefined)}
                              >
                                <Flex
                                  align={"center"}
                                  justify={"space-between"}
                                >
                                  <Flex align={"center"} w={"100%"}>
                                    <Text
                                      fw={600}
                                      onClick={(e) => {
                                        // e.stopPropagation();
                                        // setEditingIndex(index);
                                        // setEditingSessionName(thread.session_name);
                                      }}
                                      // style={{ cursor: "text" }}
                                      size={"sm"}
                                    >
                                      Chat With Supervisor
                                    </Text>
                                  </Flex>
                                  <Tooltip
                                    label={
                                      <Flex
                                        direction={"column"}
                                        style={{
                                          maxWidth: "400px",
                                          textWrap: "wrap",
                                        }}
                                      >
                                        <Text>
                                          Selix Supervisor is a manager for all
                                          the worker sessions. You can ask it
                                          question that you'd ask a "supervisor"
                                          for your outbound:
                                        </Text>
                                        <Text>
                                          - "What's my top priority right now?"
                                        </Text>
                                        <Text>
                                          - "Can you make a new session?"
                                        </Text>
                                        <Text>
                                          - "What happened last week" (coming
                                          soon)
                                        </Text>
                                      </Flex>
                                    }
                                  >
                                    <ActionIcon>
                                      <IconInfoCircle />
                                    </ActionIcon>
                                  </Tooltip>
                                </Flex>
                              </Paper>
                            )}
                            {activeThreads
                              .filter((thread) => !thread.is_supervisor_session)
                              .map((thread: any, index) => {
                                return (
                                  <Paper
                                    key={index}
                                    withBorder
                                    radius={"sm"}
                                    p={"sm"}
                                    w={"100%"}
                                    style={{
                                      // cursor: "grab",
                                      display: "inline-block",
                                      // minWidth: "350px",
                                      backgroundColor:
                                        sessionIDRef.current === thread.id
                                          ? "#d0f0c0"
                                          : "white", // Highlight if current thread
                                      borderColor:
                                        sessionIDRef.current === thread.id
                                          ? "#00796b"
                                          : "#e6ebf0", // Change border color if current thread
                                    }}
                                    className={`transition duration-300 ease-in-out transform ${
                                      sessionIDRef.current === thread.id
                                        ? "scale-105 shadow-2xl"
                                        : "hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:border-[1px] hover:!border-[#228be6] hover:!bg-[#228be6]/5"
                                    }`}
                                    onClick={() => {
                                      getMessages(thread.thread_id, thread.id);
                                      toggle();
                                    }}
                                    onMouseEnter={() => setHoverChat(thread.id)}
                                    onMouseLeave={() => setHoverChat(undefined)}
                                  >
                                    <Flex
                                      align={"center"}
                                      justify={"space-between"}
                                    >
                                      {editingIndex === index ? (
                                        <Flex
                                          align={"center"}
                                          gap={"sm"}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <TextInput
                                            value={editingSessionName}
                                            onChange={(e) =>
                                              setEditingSessionName(
                                                e.currentTarget.value
                                              )
                                            }
                                            onBlur={() =>
                                              editSession(
                                                thread.id,
                                                editingSessionName
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                editSession(
                                                  thread.id,
                                                  editingSessionName
                                                );
                                              }
                                            }}
                                            style={{
                                              width: `${
                                                editingSessionName.length + 2
                                              }ch`,
                                            }}
                                            rightSection={
                                              <ActionIcon
                                                variant="transparent"
                                                color="green"
                                                size={"sm"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  editSession(
                                                    thread.id,
                                                    editingSessionName
                                                  );
                                                }}
                                              >
                                                <IconCircleCheck size={"xl"} />
                                              </ActionIcon>
                                            }
                                          />
                                        </Flex>
                                      ) : (
                                        <Flex
                                          align={"center"}
                                          justify={"space-between"}
                                          w={"100%"}
                                        >
                                          <Tooltip
                                            label="Needs more input"
                                            withArrow
                                            position="top"
                                          >
                                            <Box mr="xs">
                                              <IconInfoCircle
                                                fill="orange"
                                                color="white"
                                                size={"1.2rem"}
                                                className="mt-1"
                                              />
                                            </Box>
                                          </Tooltip>
                                          <Flex align={"center"} gap={"xs"}>
                                            <Tooltip
                                              label={thread.session_name}
                                            >
                                              <Text
                                                fw={600}
                                                onClick={(e) => {
                                                  // e.stopPropagation();
                                                  // setEditingIndex(index);
                                                  // setEditingSessionName(thread.session_name);
                                                }}
                                                // style={{ cursor: "text" }}
                                                size={"sm"}
                                              >
                                                {thread.session_name.substring(
                                                  0,
                                                  27
                                                ) +
                                                  (thread.session_name.length >
                                                  27
                                                    ? "..."
                                                    : "") || "Untitled Session"}
                                              </Text>
                                            </Tooltip>
                                          </Flex>
                                          <Tooltip
                                            label="Edit session name"
                                            withArrow
                                            position="top"
                                          >
                                            <ActionIcon
                                              variant="transparent"
                                              // color="blue"
                                              size={"sm"}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingIndex(index);
                                                setEditingSessionName(
                                                  thread.session_name
                                                );
                                              }}
                                              style={{ marginLeft: "auto" }}
                                            >
                                              <IconEdit size={"1rem"} />
                                            </ActionIcon>
                                          </Tooltip>
                                        </Flex>
                                      )}
                                      {thread.status !== "COMPLETE" &&
                                        thread.status !== "CANCELLED" && (
                                          <>
                                            <Tooltip
                                              label="Archive session"
                                              withArrow
                                              position="top"
                                            >
                                              <ActionIcon
                                                variant="transparent"
                                                color="red"
                                                size={"sm"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setThreads((prevThreads) =>
                                                    prevThreads.map(
                                                      (prevThread) =>
                                                        prevThread.id ===
                                                        thread.id
                                                          ? {
                                                              ...prevThread,
                                                              status:
                                                                "CANCELLED",
                                                            }
                                                          : prevThread
                                                    )
                                                  );
                                                  fetch(
                                                    `${API_URL}/selix/delete_session`,
                                                    {
                                                      method: "DELETE",
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                        Authorization: `Bearer ${userToken}`,
                                                      },
                                                      body: JSON.stringify({
                                                        session_id: thread.id,
                                                      }),
                                                    }
                                                  )
                                                    .then((response) => {
                                                      if (!response.ok) {
                                                        return response
                                                          .json()
                                                          .then((data) => {
                                                            throw new Error(
                                                              data.error ||
                                                                "Failed to delete session"
                                                            );
                                                          });
                                                      }
                                                      return response.json();
                                                    })
                                                    .then((data) => {
                                                      console.log(
                                                        "Session deleted:",
                                                        data.message
                                                      );
                                                    })
                                                    .catch((error) => {
                                                      console.error(
                                                        "Error deleting session:",
                                                        error
                                                      );
                                                    });
                                                }}
                                              >
                                                {thread.status !==
                                                  "CANCELLED" &&
                                                  thread.status !==
                                                    "COMPLETE" && (
                                                    <IconArchive
                                                      size={"1rem"}
                                                    />
                                                  )}
                                              </ActionIcon>
                                            </Tooltip>
                                          </>
                                        )}
                                    </Flex>
                                  </Paper>
                                );
                              })}
                          </Stack>
                          <Stack spacing={"xs"}>
                            {needInputThreads
                              .filter((thread) => !thread.is_supervisor_session)
                              .map((thread: ThreadType, index) => {
                                return (
                                  <Paper
                                    key={index}
                                    withBorder
                                    radius={"sm"}
                                    p={"sm"}
                                    w={"100%"}
                                    style={{
                                      // cursor: "grab",
                                      // display: "inline-block",
                                      // minWidth: "350px",
                                      backgroundColor:
                                        sessionIDRef.current === thread.id
                                          ? "#d0f0c0"
                                          : "white", // Highlight if current thread
                                      borderColor:
                                        sessionIDRef.current === thread.id
                                          ? "#00796b"
                                          : "#e6ebf0", // Change border color if current thread
                                    }}
                                    className={`transition duration-300 ease-in-out transform ${
                                      sessionIDRef.current === thread.id
                                        ? "scale-105 shadow-2xl"
                                        : "hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:border-[1px] hover:!border-[#228be6] hover:!bg-[#228be6]/5"
                                    }`}
                                    onClick={() => {
                                      getMessages(thread.thread_id, thread.id);
                                      toggle();
                                    }}
                                    onMouseEnter={() => setHoverChat(thread.id)}
                                    onMouseLeave={() => setHoverChat(undefined)}
                                  >
                                    <Flex
                                      align={"center"}
                                      justify={"space-between"}
                                    >
                                      {editingIndex === index ? (
                                        <Flex
                                          align={"center"}
                                          gap={"sm"}
                                          onClick={(e) => e.stopPropagation()}
                                          w={"100%"}
                                        >
                                          <TextInput
                                            value={editingSessionName}
                                            onChange={(e) =>
                                              setEditingSessionName(
                                                e.currentTarget.value
                                              )
                                            }
                                            onBlur={() =>
                                              editSession(
                                                thread.id,
                                                editingSessionName
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                editSession(
                                                  thread.id,
                                                  editingSessionName
                                                );
                                              }
                                            }}
                                            style={{
                                              width: `${
                                                editingSessionName.length + 2
                                              }ch`,
                                            }}
                                            rightSection={
                                              <ActionIcon
                                                variant="transparent"
                                                color="green"
                                                size={"sm"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  editSession(
                                                    thread.id,
                                                    editingSessionName
                                                  );
                                                }}
                                              >
                                                <IconCircleCheck size={"xl"} />
                                              </ActionIcon>
                                            }
                                          />
                                        </Flex>
                                      ) : (
                                        <Flex
                                          align={"center"}
                                          justify={"space-between"}
                                          w={"100%"}
                                        >
                                          <Tooltip
                                            label="X more inputs"
                                            withArrow
                                            position="top"
                                          >
                                            <Box mr="xs">
                                              <IconHourglassLow
                                                fill="purple"
                                                color="white"
                                                size={"1.2rem"}
                                                className="mt-1"
                                              />
                                            </Box>
                                          </Tooltip>
                                          <Flex align={"center"} gap={"xs"}>
                                            <Tooltip
                                              label={thread.session_name}
                                            >
                                              <Text
                                                fw={600}
                                                onClick={(e) => {
                                                  // e.stopPropagation();
                                                  // setEditingIndex(index);
                                                  // setEditingSessionName(thread.session_name);
                                                }}
                                                // style={{ cursor: "text" }}
                                                size={"sm"}
                                              >
                                                {thread.session_name.substring(
                                                  0,
                                                  27
                                                ) +
                                                  (thread.session_name.length >
                                                  27
                                                    ? "..."
                                                    : "") || "Untitled Session"}
                                              </Text>
                                            </Tooltip>
                                          </Flex>
                                          <Tooltip
                                            label="Edit session name"
                                            withArrow
                                            position="top"
                                          >
                                            <ActionIcon
                                              variant="transparent"
                                              // color="blue"
                                              size={"sm"}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingIndex(index);
                                                setEditingSessionName(
                                                  thread.session_name
                                                );
                                              }}
                                              style={{ marginLeft: "auto" }}
                                            >
                                              <IconEdit size={"1rem"} />
                                            </ActionIcon>
                                          </Tooltip>
                                        </Flex>
                                      )}
                                      {
                                        <>
                                          <Tooltip
                                            label="Archive session"
                                            withArrow
                                            position="top"
                                          >
                                            <ActionIcon
                                              variant="transparent"
                                              color="red"
                                              size={"sm"}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setThreads((prevThreads) =>
                                                  prevThreads.map(
                                                    (prevThread) =>
                                                      prevThread.id ===
                                                      thread.id
                                                        ? {
                                                            ...prevThread,
                                                            status: "CANCELLED",
                                                          }
                                                        : prevThread
                                                  )
                                                );
                                                fetch(
                                                  `${API_URL}/selix/delete_session`,
                                                  {
                                                    method: "DELETE",
                                                    headers: {
                                                      "Content-Type":
                                                        "application/json",
                                                      Authorization: `Bearer ${userToken}`,
                                                    },
                                                    body: JSON.stringify({
                                                      session_id: thread.id,
                                                    }),
                                                  }
                                                )
                                                  .then((response) => {
                                                    if (!response.ok) {
                                                      return response
                                                        .json()
                                                        .then((data) => {
                                                          throw new Error(
                                                            data.error ||
                                                              "Failed to delete session"
                                                          );
                                                        });
                                                    }
                                                    return response.json();
                                                  })
                                                  .then((data) => {
                                                    console.log(
                                                      "Session deleted:",
                                                      data.message
                                                    );
                                                  })
                                                  .catch((error) => {
                                                    console.error(
                                                      "Error deleting session:",
                                                      error
                                                    );
                                                  });
                                              }}
                                            >
                                              {thread.status !== "CANCELLED" &&
                                                thread.status !==
                                                  "COMPLETE" && (
                                                  <IconArchive size={"1rem"} />
                                                )}
                                            </ActionIcon>
                                          </Tooltip>
                                        </>
                                      }
                                    </Flex>
                                  </Paper>
                                );
                              })}
                          </Stack>
                        </Stack>

                        <Stack spacing={"xs"} mt={"xl"}>
                          <Flex align={"center"} justify={"space-between"}>
                            <Flex align={"center"} gap={"sm"}>
                              <IconCircleCheck color="green" size={"1.4rem"} />
                              <Text size={"md"} fw={600}>
                                Completed Sessions
                              </Text>
                              <Badge color="green" size="sm">
                                {completedThreads.length}
                              </Badge>
                            </Flex>
                            <ActionIcon onClick={CompleteToggle}>
                              {!completedOpened ? (
                                <IconChevronDown size={"1rem"} />
                              ) : (
                                <IconChevronUp size={"1rem"} />
                              )}
                            </ActionIcon>
                          </Flex>
                          <Collapse
                            in={completedOpened}
                            transitionTimingFunction="linear"
                          >
                            <Stack spacing={"xs"}>
                              {completedThreads.map(
                                (thread: ThreadType, index) => {
                                  return (
                                    <Paper
                                      key={index}
                                      withBorder
                                      radius={"sm"}
                                      p={"sm"}
                                      w={"100%"}
                                      style={{
                                        // cursor: "grab",
                                        // display: "inline-block",
                                        // minWidth: "350px",
                                        backgroundColor:
                                          sessionIDRef.current === thread.id
                                            ? "#d0f0c0"
                                            : "white", // Highlight if current thread
                                        borderColor:
                                          sessionIDRef.current === thread.id
                                            ? "#00796b"
                                            : "#e6ebf0", // Change border color if current thread
                                      }}
                                      className={`transition duration-300 ease-in-out transform ${
                                        sessionIDRef.current === thread.id
                                          ? "scale-105 shadow-2xl"
                                          : "hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:border-[1px] hover:!border-[#228be6] hover:!bg-[#228be6]/5"
                                      }`}
                                      onClick={() => {
                                        getMessages(
                                          thread.thread_id,
                                          thread.id
                                        );
                                        toggle();
                                      }}
                                      onMouseEnter={() =>
                                        setHoverChat(thread.id)
                                      }
                                      onMouseLeave={() =>
                                        setHoverChat(undefined)
                                      }
                                    >
                                      <Flex
                                        align={"center"}
                                        justify={"space-between"}
                                      >
                                        {editingIndex === index ? (
                                          <Flex
                                            align={"center"}
                                            gap={"sm"}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <TextInput
                                              value={editingSessionName}
                                              onChange={(e) =>
                                                setEditingSessionName(
                                                  e.currentTarget.value
                                                )
                                              }
                                              onBlur={() =>
                                                editSession(
                                                  thread.id,
                                                  editingSessionName
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  editSession(
                                                    thread.id,
                                                    editingSessionName
                                                  );
                                                }
                                              }}
                                              style={{
                                                width: `${
                                                  editingSessionName.length + 2
                                                }ch`,
                                              }}
                                              rightSection={
                                                <ActionIcon
                                                  variant="transparent"
                                                  color="green"
                                                  size={"sm"}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    editSession(
                                                      thread.id,
                                                      editingSessionName
                                                    );
                                                  }}
                                                >
                                                  <IconCircleCheck
                                                    size={"xl"}
                                                  />
                                                </ActionIcon>
                                              }
                                            />
                                          </Flex>
                                        ) : (
                                          <Flex align={"center"}>
                                            <Tooltip
                                              label="Needs more input"
                                              withArrow
                                              position="top"
                                            >
                                              <Box mr="xs">
                                                <IconCircleCheck
                                                  color="green"
                                                  size={"1.2rem"}
                                                />
                                              </Box>
                                            </Tooltip>
                                            <Tooltip
                                              label={thread.session_name}
                                            >
                                              <Text
                                                fw={600}
                                                onClick={(e) => {
                                                  // e.stopPropagation();
                                                  // setEditingIndex(index);
                                                  // setEditingSessionName(thread.session_name);
                                                }}
                                                // style={{ cursor: "text" }}
                                                size={"sm"}
                                              >
                                                {thread.session_name.substring(
                                                  0,
                                                  27
                                                ) +
                                                  (thread.session_name.length >
                                                  27
                                                    ? "..."
                                                    : "") || "Untitled Session"}
                                              </Text>
                                            </Tooltip>
                                          </Flex>
                                        )}
                                        <ActionIcon
                                          variant="transparent"
                                          ml={"auto"}
                                          size={"sm"}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingIndex(index);
                                            setEditingSessionName(
                                              thread.session_name
                                            );
                                          }}
                                          style={{ marginLeft: "auto" }}
                                        >
                                          <IconEdit size={"1rem"} />
                                        </ActionIcon>
                                        {
                                          <>
                                            <Tooltip
                                              label="Archive session"
                                              withArrow
                                              position="top"
                                            >
                                              <ActionIcon
                                                variant="transparent"
                                                color="red"
                                                size={"sm"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setThreads((prevThreads) =>
                                                    prevThreads.map(
                                                      (prevThread) =>
                                                        prevThread.id ===
                                                        thread.id
                                                          ? {
                                                              ...prevThread,
                                                              status:
                                                                "CANCELLED",
                                                            }
                                                          : prevThread
                                                    )
                                                  );
                                                  fetch(
                                                    `${API_URL}/selix/delete_session`,
                                                    {
                                                      method: "DELETE",
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                        Authorization: `Bearer ${userToken}`,
                                                      },
                                                      body: JSON.stringify({
                                                        session_id: thread.id,
                                                      }),
                                                    }
                                                  )
                                                    .then((response) => {
                                                      if (!response.ok) {
                                                        return response
                                                          .json()
                                                          .then((data) => {
                                                            throw new Error(
                                                              data.error ||
                                                                "Failed to delete session"
                                                            );
                                                          });
                                                      }
                                                      return response.json();
                                                    })
                                                    .then((data) => {
                                                      console.log(
                                                        "Session deleted:",
                                                        data.message
                                                      );
                                                    })
                                                    .catch((error) => {
                                                      console.error(
                                                        "Error deleting session:",
                                                        error
                                                      );
                                                    });
                                                }}
                                              >
                                                {thread.status !==
                                                  "CANCELLED" &&
                                                  thread.status !==
                                                    "COMPLETE" && (
                                                    <IconArchive
                                                      size={"1rem"}
                                                    />
                                                  )}
                                              </ActionIcon>
                                            </Tooltip>
                                          </>
                                        }
                                      </Flex>
                                      <Flex align={"center"} gap={"xs"}>
                                        {thread.status === "ACTIVE" && (
                                          <Flex align={"center"} gap={4}>
                                            {/* <div className="flex items-center justify-center bg-green-100 rounded-full p-1 border-green-300 border-[1px] border-solid">
                                        <div className="w-[6px] h-[6px] bg-green-500 rounded-full"></div>
                                      </div>
                                      <Text color="green" fw={500} size={"sm"}>
                                        Live
                                      </Text> */}
                                            <Text
                                              size={"xs"}
                                              fw={500}
                                              color="gray"
                                            >
                                              Time remaining:
                                            </Text>
                                          </Flex>
                                        )}
                                        {thread.status ===
                                          "PENDING_OPERATOR" && (
                                          <Flex align={"center"} gap={4}>
                                            {/* <div className="flex items-center justify-center bg-yellow-100 rounded-full p-1 border-yellow-300 border-[1px] border-solid">
                                        <div className="w-[6px] h-[6px] bg-yellow-500 rounded-full"></div>
                                      </div>
                                      <Text color="yellow" fw={500} size={"sm"}>
                                        In Progress
                                      </Text> */}
                                            <Text
                                              size={"xs"}
                                              fw={500}
                                              color="gray"
                                            >
                                              Time remaining:
                                            </Text>
                                          </Flex>
                                        )}
                                        {thread.status === "BLOCKED" && (
                                          <Flex align={"center"} gap={4}>
                                            {/* <div className="flex items-center justify-center bg-red-100 rounded-full p-1 border-red-300 border-[1px] border-solid">
                                        <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
                                      </div>
                                      <Text color="red" fw={500} size={"sm"}>
                                        Blocked
                                      </Text> */}
                                            <Text
                                              size={"xs"}
                                              fw={500}
                                              color="gray"
                                            >
                                              Time remaining:
                                            </Text>
                                          </Flex>
                                        )}
                                        {thread.status === "COMPLETE" && (
                                          <Flex align={"center"} gap={4}>
                                            {/* <div className="flex items-center justify-center bg-blue-100 rounded-full p-1 border-blue-300 border-[1px] border-solid">
                                        <div className="w-[6px] h-[6px] bg-blue-500 rounded-full"></div>
                                      </div>
                                      <Text color="blue" fw={500} size={"sm"}>
                                        Done
                                      </Text> */}
                                            <Text
                                              size={"xs"}
                                              fw={500}
                                              color="gray"
                                            >
                                              Finished in:
                                            </Text>
                                          </Flex>
                                        )}
                                        {thread.status === "CANCELLED" && (
                                          <Flex align={"center"} gap={4}>
                                            {/* <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 border-gray-300 border-[1px] border-solid">
                                        <div className="w-[6px] h-[6px] bg-gray-500 rounded-full"></div>
                                      </div>
                                      <Text color="gray" fw={500} size={"sm"}>
                                        Cancelled
                                      </Text> */}
                                            <Text
                                              size={"xs"}
                                              fw={500}
                                              color="gray"
                                            >
                                              Finished in:
                                            </Text>
                                          </Flex>
                                        )}

                                        <Text color="gray" size={"xs"}>
                                          {thread.estimated_completion_time
                                            ? moment(
                                                thread.estimated_completion_time
                                              ).fromNow()
                                            : "N/A"}{" "}
                                          {(thread.status === "ACTIVE" ||
                                            thread.status === "IN_PROGRESS") &&
                                            "remaining"}
                                        </Text>
                                      </Flex>
                                    </Paper>
                                  );
                                }
                              )}
                            </Stack>
                          </Collapse>
                        </Stack>
                      </>
                    )}
                  </ScrollArea>
                </Box>
              </Paper>
              <Flex w={"100%"} gap={"md"} p={"lg"}>
                <DragDropContext
                  onDragEnd={(result) => {
                    if (
                      result &&
                      result.destination &&
                      result.destination.droppableId === "droppable-area"
                    ) {
                      if (!result.draggableId.includes("-")) {
                        return;
                      }
                      const attachedTaskId = Number(
                        result.draggableId.split("-")[1]
                      );
                      const task = tasks.find(
                        (task) => task.id === attachedTaskId
                      );
                      setAttachedInternalTask(task);
                      return;
                    }

                    if (!result.destination) {
                      return;
                    }
                    onDragEnd({
                      destination: { index: result.destination.index },
                      source: { index: result.source.index },
                    });
                  }}
                >
                  <SegmentChat
                    setIntendedTaskChange={setIntendedTaskChange}
                    setAttachedFile={setAttachedFile}
                    attachedFile={attachedFile}
                    threads={threads}
                    deviceIDRef={deviceIDRef}
                    dropzoneRef={dropzoneRef}
                    suggestedFirstMessage={suggestedFirstMessage}
                    setSuggestionHidden={setSuggestionHidden}
                    suggestionHidden={suggestionHidden}
                    suggestion={suggestion}
                    handleSubmit={handleSubmit}
                    attachedInternalTask={attachedInternalTask}
                    setAttachedInternalTask={setAttachedInternalTask}
                    prompt={prompt}
                    promptRef={promptRef}
                    setPrompt={setPrompt}
                    setSegment={setSegment}
                    messages={messages}
                    setMessages={setMessages}
                    segment={segment}
                    setAIType={setAIType}
                    recording={recording}
                    setRecording={setRecording}
                    aiType={aiType}
                    currentSessionId={sessionIDRef.current}
                    memoryState={
                      threads.find(
                        (thread) => thread.id === sessionIDRef.current
                      )?.memory.memory_state
                    }
                    memory={
                      threads.find(
                        (thread) => thread.id === sessionIDRef.current
                      )?.memory
                    }
                    // generateResponse={generateResponse}
                    // chatContent={chatContent}
                    // setChatContent={setChatContent}
                  />
                  <SelixControlCenter
                    setTasks={setTasks}
                    refreshAssetLibrary={refreshAssetLibrary}
                    attachedFile={attachedFile}
                    counter={counter}
                    recording={recording}
                    tasks={tasks}
                    setPrompt={setPrompt}
                    handleSubmit={handleSubmit}
                    setAIType={setAIType}
                    aiType={aiType}
                    threads={threads}
                    messages={messages}
                    setMessages={setMessages}
                    currentSessionId={sessionIDRef.current}
                  />
                </DragDropContext>
              </Flex>
            </Flex>
          )}
        </Card>
      </DropzoneWrapper>
      <SelixMemoryLogs
        threads={threads}
        onRevert={(oldLog: string) => {
          setSupervisorMemoryLine(oldLog);
          setMemoryStateChanged(true);
        }}
        opened={openEventLogs}
        setOpen={(isOpen: boolean) => setOpenEventLogs(isOpen)}
        sessionId={sessionIDRef.current as number}
      ></SelixMemoryLogs>
    </>
  );
}

const SegmentChat = (props: any) => {
  const attachedFile = props.attachedFile;
  const setAttachedFile = props.setAttachedFile;
  const suggestedFirstMessage: (string | SuggestedMessage)[] =
    props.suggestedFirstMessage;
  const handleSubmit: (
    file?: { name: string; description: string; base64: string },
    forcePrompt?: string,
    sendAsSelix?: boolean,
    sendSlack?: boolean,
    sendEmail?: boolean,
    scheduleDay?: Date
  ) => Promise<void> = props.handleSubmit;
  const dropzoneRef = props.dropzoneRef;
  const prompt = props.prompt;
  const aiType = props.aiType;
  const promptRef = props.promptRef;
  const suggestion = props.suggestion;
  const suggestionHidden = props.suggestionHidden;
  const setSuggestionHidden = props.setSuggestionHidden;
  const recording = props.recording;
  const setRecording = props.setRecording;
  const deviceIDRef = props.deviceIDRef;
  const sessionId = props.currentSessionId;
  const setPrompt = props.setPrompt;
  const messages: MessageType[] = props.messages;
  const attachedInternalTask: TaskType | undefined = props.attachedInternalTask;
  const userData = useRecoilValue(userDataState);
  const userToken = useRecoilValue(userTokenState);
  const [showLoader, setShowLoader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sendAsSelix, setSendAsSelix] = useState(false);
  const setIntendedTaskChange = props.setIntendedTaskChange;
  const [sendSlack, setSendSlack] = useState(false);
  const [scheduleDay, setScheduleDay] = useState<Date | undefined>(undefined);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  // const [recording, setRecording] = useState(false);

  const isInternal = window.location.href.includes("internal");

  const messageRefs = useRef<any>([]);

  const [normalInputMode, setNormalInputMode] = useState(true);

  const lastPromptRef = useRef<string>("");

  const processTranscription = async () => {
    try {
      const response = await fetch(
        `${API_URL}/selix/post_process_transcription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            device_id: deviceIDRef.current,
            sentence_to_correct: promptRef.current,
          }),
        }
      );
    } catch (error) {
      console.error("Error processing transcription:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (recording) {
      interval = setInterval(() => {
        if (promptRef.current !== lastPromptRef.current) {
          lastPromptRef.current = promptRef.current;
          processTranscription();
        }
      }, 4000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recording]);

  const viewport = useRef<any>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  useEffect(() => {
    if (aiType === "PLANNER" && viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [aiType]);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [{ ...messages }]);

  const slideDown = () => {
    setSuggestionHidden(true);
    const div = document.getElementById("slidingDiv");
    if (div) {
      div.style.animation = "slideDown 0.5s forwards";
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      setRecording(false);
      handleSubmit(
        undefined,
        undefined,
        sendAsSelix,
        sendSlack,
        sendEmail,
        scheduleDay
      );
      setScheduleDay(undefined);
      setIntendedTaskChange(undefined);
      props.setAttachedInternalTask(undefined);
    }
  };

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [uncollapsedCards, setUncollapsedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const [clientMemoryState, setClientMemoryState] = useState<
    string | undefined
  >(props.memory?.memory_line);
  useState<any>(props.memory?.memory_line_time_updated);
  const [memoryState, setMemoryState] = useState<any>(props.memoryState);

  const handleListClick = async (prompt: string) => {
    handleSubmit(undefined, prompt);
    setShouldSubmit(true);
  };

  const toggleCardCollapse = (index: number) => {
    setUncollapsedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (prompt === "") {
      //reset the text area height so the placeholder shows nicely
      console.log("setting to auto");
      setNormalInputMode(true);
      if (textareaRef.current) {
        textareaRef.current!.style.height = "auto";
      }
    } else if (
      normalInputMode &&
      (prompt.length > 120 || promptRef.current.length > 120)
    ) {
      setNormalInputMode(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "500px";
      }
    }
  }, [prompt.length, promptRef.current.length]);

  useEffect(() => {
    handleSubmit();
    setRecording(false);
  }, [shouldSubmit]);

  let formattedMemoryLine = clientMemoryState;
  const sessions = memoryState?.sessions;

  if (sessions && Array.isArray(sessions)) {
    for (const session of sessions) {
      if (formattedMemoryLine?.includes(session.title)) {
        let titleToReplace = session.title;
        if (formattedMemoryLine?.includes("@" + session.title)) {
          titleToReplace = "@" + session.title;
        }
        formattedMemoryLine = formattedMemoryLine.replace(
          titleToReplace,
          `<span style="color: #333; cursor: pointer; border: 1px solid gray; padding: 1px 4px; background-color: white; border-radius: 4px;" data-title="${titleToReplace}">${titleToReplace}</span>`
        );
      }
    }
  }

  return (
    <>
      <Paper withBorder shadow="sm" radius={"md"} w={"40%"} h={"100%"}>
        <Flex
          px={"md"}
          py={"xs"}
          align={"center"}
          gap={5}
          bg={"white"}
          className={" rounded-t-md"}
          justify={"space-between"}
        >
          <Flex align={"center"}>
            <IconSparkles size={"1rem"} color="#E25DEE" fill="#E25DEE" />
            <Text fw={600}>Chat with Selix</Text>
          </Flex>
          <Badge color="gray" variant="outline" radius={4} ml="auto">
            {(() => {
              let emoji = "🧠";

              switch (props.memory?.session_mode) {
                case "campaign_builder":
                  emoji = "⚙️";
                  break;
                case "ingestion_mode":
                  emoji = "🍗";
                  break;
                case "supervisor_mode":
                  emoji = "🧑";
                  break;
                default:
                  emoji = "🧠";
              }

              return `${emoji} ${props.memory?.session_mode?.replace(
                "_",
                " "
              )}`;
            })()}
          </Badge>
        </Flex>
        <Divider bg="gray" />
        <div style={{ position: "relative", height: "48vh" }}>
          <ScrollArea
            h={"53vh"}
            viewportRef={viewport}
            scrollHideDelay={4000}
            style={{
              overflow: "hidden",
              // transform: !normalInputMode ? "translateY(-250px)" : "none",
              transition: "transform 0.3s ease",
            }}
          >
            {messages.length > 0 ? (
              <Flex
                direction={"column"}
                gap={"sm"}
                p={"md"}
                h={"100%"}
                className=" overflow-auto"
              >
                {messages.map((message: MessageType, index: number) => {
                  return (
                    <>
                      {message.type === "message" ||
                      message.type === "slack" ? (
                        <>
                          {/* name section */}
                          <Flex
                            gap={4}
                            align={"center"}
                            ml={message.role === "user" ? "auto" : "0"}
                            style={{
                              width:
                                messageRefs.current[index]?.offsetWidth ||
                                "85%",
                              marginBottom: "-10px",
                            }}
                          >
                            <Avatar
                              src={
                                message.sender_name
                                  ? null
                                  : message.role === "user"
                                  ? userData.img_url
                                  : Logo
                              }
                              size={"xs"}
                              radius={"xl"}
                            />
                            <Text fw={600} size={"xs"}>
                              {message.sender_name
                                ? message.sender_name
                                : message.role !== "assistant"
                                ? userData.sdr_name
                                : "Selix AI"}
                              {message.type === "slack" &&
                                message.slack_channel && (
                                  <Text component="span" fw={700}>
                                    {" via "}
                                    <img
                                      src={SlackLogo}
                                      alt="slack"
                                      width={10}
                                      height={10}
                                      style={{ margin: "0 4px" }}
                                    />
                                    {" Slack"}
                                    <Text
                                      component="a"
                                      href={`https://slack.com/app_redirect?channel=${message.slack_channel}`}
                                      style={{
                                        color: "#1E90FF",
                                        textDecoration: "underline",
                                        marginLeft: "4px",
                                      }}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      #{message.slack_channel}
                                    </Text>
                                  </Text>
                                )}
                            </Text>
                            {message.role !== "user" &&
                              message.message !== "loading" &&
                              index === messages.length - 1 && (
                                <Flex align="center" gap="xs">
                                  {showLoader && (
                                    <Loader
                                      variant="bars"
                                      color="grape"
                                      size="xs"
                                      ml={10}
                                    />
                                  )}
                                </Flex>
                              )}
                          </Flex>
                          {/* rest of message */}
                          <Flex
                            direction={"column"}
                            maw={"85%"}
                            gap={4}
                            key={index}
                            ml={message.role === "user" ? "auto" : "0"}
                            style={{
                              backgroundColor: message.hidden_until
                                ? "#ADD8E6"
                                : message.role === "user"
                                ? "#f7ffff"
                                : "#fafafa",
                              borderRadius: "10px",
                              border: "1px solid #e7ebef",
                              padding: "10px",
                            }}
                            ref={(el) => (messageRefs.current[index] = el)}
                          >
                            <Flex
                              className=" rounded-lg rounded-br-none"
                              px={"sm"}
                              py={7}
                            >
                              <Text size={"xs"} fw={500}>
                                {message.role === "user" ? (
                                  message.message
                                    .split(" ")
                                    .map(
                                      (x) =>
                                        x.substring(0, 40) +
                                        (x.length > 40 ? "..." : "")
                                    )
                                    .join(" ")
                                ) : message.message === "loading" ? (
                                  <Flex align="center" gap="xs">
                                    <Loader color="black" variant="dots" />
                                  </Flex>
                                ) : (
                                  <Text>
                                    {message.message
                                      .split(" ")
                                      .map(
                                        (x) =>
                                          x.substring(0, 40) +
                                          (x.length > 40 ? "..." : "")
                                      )
                                      .join(" ")
                                      .split("\n")
                                      .map((line, index) => (
                                        <Fragment key={index}>
                                          {line}
                                          <br />
                                        </Fragment>
                                      ))}
                                  </Text>
                                )}
                              </Text>
                            </Flex>
                            <Text
                              color="gray"
                              size={"xs"}
                              ml={message.role === "user" ? "auto" : "0"}
                            >
                              <Text
                                color={message.hidden_until ? "white" : "gray"}
                                size="xs"
                                ml={message.role === "user" ? "auto" : "0"}
                              >
                                {message.hidden_until ? (
                                  <>
                                    <style>
                                      {`
                                        @keyframes spin {
                                          0% { transform: rotate(0deg); }
                                          100% { transform: rotate(360deg); }
                                        }
                                      `}
                                    </style>
                                    <IconClockHour12
                                      size={"0.8rem"}
                                      style={{
                                        animation: "spin 2s linear infinite",
                                      }}
                                    />{" "}
                                    {moment(message.hidden_until).format(
                                      "MMMM D, h:mm A"
                                    )}
                                  </>
                                ) : (
                                  moment(message.created_time).format(
                                    "MMMM D, h:mm A"
                                  )
                                )}
                              </Text>
                            </Text>
                          </Flex>
                        </>
                      ) : (
                        <Card
                          key={index}
                          className="border border-[#E25DEE] border-solid rounded-md"
                          shadow="sm"
                          withBorder
                          radius="md"
                          style={{ marginLeft: 0 }}
                        >
                          <Card.Section>
                            <Flex
                              justify="space-between"
                              align="center"
                              className="bg-[#E25DEE] py-2 px-3 text-white text-semibold cursor-pointer"
                              onClick={() => toggleCardCollapse(index)}
                            >
                              {!messages[index + 1] && (
                                <Loader size="sm" color="white" />
                              )}

                              <Text fw={600} size="xs">
                                ✨ {message.action_title}
                              </Text>
                              {!uncollapsedCards[index] ? (
                                <IconChevronDown
                                  size={16}
                                  className="transition-transform"
                                />
                              ) : (
                                <IconChevronUp
                                  size={16}
                                  className="transition-transform"
                                />
                              )}
                            </Flex>
                          </Card.Section>
                          {uncollapsedCards[index] && (
                            <Text size="xs" fw={400} color="gray" mt="xs">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    message.action_description?.replaceAll(
                                      "\n",
                                      "<br/><br/>"
                                    ) || "",
                                }}
                              />
                            </Text>
                          )}
                        </Card>
                      )}
                    </>
                  );
                })}
                {/* {loading && <Loader color="blue" type="dots" />} */}
              </Flex>
            ) : (
              <>
                <Flex
                  direction={"column"}
                  gap={"sm"}
                  p={"md"}
                  h={"100%"}
                  className=" overflow-auto"
                >
                  {messages.map((message: MessageType, index: number) => {
                    return (
                      <>
                        {message.type === "message" ? (
                          <Flex
                            direction={"column"}
                            w={"50%"}
                            gap={4}
                            key={index}
                            align="center"
                            justify="center"
                            mx="auto"
                          >
                            {/* <Flex gap={4} align={"center"}>
                          <Avatar
                            src={
                              message.role === "user" ? userData.img_url : Logo
                            }
                            size={"xs"}
                            radius={"xl"}
                          />
                          <Text fw={600} size={"xs"}>
                            {message.role !== "assistant"
                              ? userData.sdr_name
                              : "Selix AI"}
                          </Text>
                          {message.role !== "user" &&
                            message.message === "loading" && (
                              <Flex align="center" gap="xs">
                                <Loader
                                  variant="bars"
                                  color="grape"
                                  size="xs"
                                  ml={10}
                                />
                              </Flex>
                            )}
                        </Flex> */}
                            {/* <Flex
                          className="border-[2px] border-solid border-[#e7ebef] rounded-lg rounded-br-none"
                          px={"sm"}
                          py={7}
                        >
                          <Text size={"sm"} fw={500}>
                            {message.role === "user" ? (
                              message.message
                            ) : message.message === "loading" ? (
                              <Flex align="center" gap="xs">
                                <Loader color="black" variant="dots" />
                              </Flex>
                            ) : (
                              <Text>
                                {message.message
                                  .split("\n")
                                  .map((line, index) => (
                                    <Fragment key={index}>
                                      {line}
                                      <br />
                                    </Fragment>
                                  ))}
                              </Text>
                            )}
                          </Text>
                        </Flex> */}
                            {/* <Text
                          color="gray"
                          size={"xs"}
                          ml={message.role === "user" ? "auto" : "0"}
                        >
                          {moment(message.created_time).format(
                            "MMMM D, h:mm A"
                          )}
                        </Text> */}
                          </Flex>
                        ) : (
                          <Card
                            key={index}
                            className="border border-[#E25DEE] border-solid rounded-md"
                            shadow="sm"
                            withBorder
                            radius="md"
                            style={{ marginLeft: 0 }}
                          >
                            <Card.Section>
                              <Flex
                                justify="space-between"
                                align="center"
                                className="bg-[#E25DEE] py-2 px-3 text-white text-semibold cursor-pointer"
                                onClick={() => toggleCardCollapse(index)}
                              >
                                <Text fw={600} size="xs">
                                  ✨ Executing: {message.action_title}
                                </Text>
                                {uncollapsedCards[index] ? (
                                  <IconChevronDown
                                    size={16}
                                    className="transition-transform"
                                  />
                                ) : (
                                  <IconChevronUp
                                    size={16}
                                    className="transition-transform"
                                  />
                                )}
                              </Flex>
                            </Card.Section>
                            {!uncollapsedCards[index] && (
                              <Text size="xs" fw={400} color="gray" mt="xs">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      message.action_description?.replaceAll(
                                        "\n",
                                        "<br/><br/>"
                                      ) || "",
                                  }}
                                />
                              </Text>
                            )}
                          </Card>
                        )}
                      </>
                    );
                  })}
                </Flex>
                {/* <div className="absolute bottom-2 right-0 w-5/6 pr-4"> */}
                {/*   <Paper */}
                {/*     withBorder */}
                {/*     p={"md"} */}
                {/*     radius={"lg"} */}
                {/*     className="bg-white shadow-lg" */}
                {/*     style={{ */}
                {/*       border: "2px solid #E25DEE", */}
                {/*       boxShadow: "0 8px 16px rgba(226, 93, 238, 0.2)", */}
                {/*     }} */}
                {/*   > */}
                {/*     <Text fw={700} size={"md"} color="#E25DEE" mb={"sm"}> */}
                {/*       💡 Suggestions */}
                {/*     </Text> */}
                {/*     <div className="flex flex-col gap-2"> */}
                {/*       {suggestedFirstMessage.map((message, index) => ( */}
                {/*         <Paper */}
                {/*           key={index} */}
                {/*           withBorder */}
                {/*           p={"xs"} */}
                {/*           radius={"md"} */}
                {/*           className={`hover:border-[#E25DEE] cursor-pointer transition-all duration-300 transform hover:scale-110 ${ */}
                {/*             typeof message !== "string" ? "bg-blue-100" : "" */}
                {/*           }`} */}
                {/*           style={{ */}
                {/*             boxShadow: "0 6px 12px rgba(226, 93, 238, 0.3)", */}
                {/*             transition: */}
                {/*               "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out", */}
                {/*           }} */}
                {/*           onMouseEnter={(e) => { */}
                {/*             e.currentTarget.style.boxShadow = */}
                {/*               "0 12px 24px rgba(226, 93, 238, 0.5)"; */}
                {/*             e.currentTarget.style.transform = */}
                {/*               "translateY(-4px) scale(1.05)"; */}
                {/*           }} */}
                {/*           onMouseLeave={(e) => { */}
                {/*             e.currentTarget.style.boxShadow = */}
                {/*               "0 6px 12px rgba(226, 93, 238, 0.3)"; */}
                {/*             e.currentTarget.style.transform = */}
                {/*               "translateY(0) scale(1)"; */}
                {/*           }} */}
                {/*           onClick={(e) => { */}
                {/*             if (e.currentTarget) { */}
                {/*               e.currentTarget.style.backgroundColor = "#F3E8FF"; */}
                {/*               setTimeout(() => { */}
                {/*                 if (e.currentTarget) { */}
                {/*                   e.currentTarget.style.backgroundColor = */}
                {/*                     "white"; */}
                {/*                 } */}
                {/*               }, 300); */}
                {/*             } */}
                {/*             if (typeof message === "string") { */}
                {/*               handleListClick(message); */}
                {/*             } else if (typeof message === "object") { */}
                {/*               //attach the strategy here. */}
                {/*               handleListClick(message.transcript); */}
                {/*             } */}
                {/*           }} */}
                {/*         > */}
                {/*           <Flex */}
                {/*             align={"center"} */}
                {/*             gap={"xs"} */}
                {/*             className="transition-transform duration-300 transform hover:translate-x-2" */}
                {/*           > */}
                {/*             <ThemeIcon */}
                {/*               color={ */}
                {/*                 typeof message === "string" ? "grape" : "blue" */}
                {/*               } */}
                {/*               size={"xl"} */}
                {/*             > */}
                {/*               <IconBrain size={"1.4rem"} /> */}
                {/*             </ThemeIcon> */}
                {/*             <Text */}
                {/*               color={ */}
                {/*                 typeof message === "string" ? "#E25DEE" : "blue" */}
                {/*               } */}
                {/*               fw={600} */}
                {/*               size={"sm"} */}
                {/*               className="transition-colors duration-300 hover:text-[#49494]" */}
                {/*             > */}
                {/*               {typeof message === "string" */}
                {/*                 ? message */}
                {/*                 : message.name} */}
                {/*             </Text> */}
                {/*             {typeof message !== "string" && ( */}
                {/*               <ThemeIcon */}
                {/*                 color="blue" */}
                {/*                 size={"sm"} */}
                {/*                 className="ml-auto" */}
                {/*               > */}
                {/*                 <IconChevronRight size={"1rem"} /> */}
                {/*               </ThemeIcon> */}
                {/*             )} */}
                {/*           </Flex> */}
                {/*         </Paper> */}
                {/*       ))} */}
                {/*     </div> */}
                {/*   </Paper> */}
                {/* </div> */}
              </>
            )}
          </ScrollArea>
        </div>
        <div style={{ position: "relative" }}>
          {/* <div */}
          {/*   style={{ */}
          {/*     width: "80%", */}
          {/*     position: "absolute", */}
          {/*     top: suggestion !== "" ? "-75px" : "0", */}
          {/*     left: "50%", */}
          {/*     transform: "translateX(-50%)", */}
          {/*     overflow: "hidden", */}
          {/*     height: suggestion !== "" ? "auto" : "0", */}
          {/*     visibility: suggestion !== "" ? "visible" : "hidden", */}
          {/*     zIndex: 1, */}
          {/*   }} */}
          {/* > */}
          {/*   { */}
          {/*     <div */}
          {/*       id="slidingDiv" */}
          {/*       style={{ */}
          {/*         backgroundColor: suggestionHidden ? "transparent" : "#E25DEE", */}
          {/*         padding: "13px", */}
          {/*         borderRadius: "8px", */}
          {/*         color: "white", */}
          {/*         fontWeight: "bold", */}
          {/*         textAlign: "center", */}
          {/*         fontSize: "0.9rem", */}
          {/*         animation: */}
          {/*           suggestion !== "" ? "slideUp 0.5s forwards" : "none", */}
          {/*       }} */}
          {/*     > */}
          {/*       {"💡 " + suggestion} */}
          {/*       <span */}
          {/*         style={{ */}
          {/*           position: "absolute", */}
          {/*           top: "5px", */}
          {/*           right: "10px", */}
          {/*           cursor: "pointer", */}
          {/*           fontWeight: "bold", */}
          {/*         }} */}
          {/*         onClick={() => slideDown()} */}
          {/*       > */}
          {/*         X */}
          {/*       </span> */}
          {/*     </div> */}
          {/*   } */}
          {/* </div> */}
          <Paper
            p={"sm"}
            withBorder
            radius={"md"}
            className="bg-[#f7f8fa]"
            my={"lg"}
            mx={"md"}
            style={{
              height: normalInputMode ? "200px" : "500px",
              marginTop: normalInputMode ? "50px" : "-240px",
              transition: "margin-top 0.3s ease",
            }}
          >
            <style>
              {`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            @keyframes slideDown {
              from {
                transform: translateY(0);
              }
              to {
                transform: translateY(100%);
              }
            }
          `}
            </style>
            <Textarea
              ref={textareaRef}
              value={prompt}
              placeholder={sendAsSelix ? "Chat To User..." : "Chat with AI..."}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setPrompt(e.target.value);
                const textarea = e.target;
                textarea.style.height = normalInputMode ? "500px" : "500px";
              }}
              variant="unstyled"
              inputContainer={(children) => (
                <div style={{ minHeight: "0px", cursor: "default" }}>
                  {children}
                </div>
              )}
              maxRows={10}
              style={{
                height: normalInputMode ? "70%" : "87%",
                resize: "none",
                overflow: "hidden",
                cursor: "default",
                fontSize: "1rem",
                padding: "10px",
                border:
                  prompt.trim().length === 0
                    ? "2px solid #D8BFD8"
                    : "1px solid #ccc",
                borderRadius: "8px",
                boxShadow:
                  prompt.trim().length === 0 ? "0 0 10px #D8BFD8" : "none",
                animation:
                  prompt.trim().length === 0
                    ? "glow 1.5s infinite alternate"
                    : "none",
              }}
            />
            <style>
              {`
              @keyframes glow {
                from {
                  box-shadow: 0 0 5px #D8BFD8;
                }
                to {
                  box-shadow: 0 0 15px #D8BFD8;
                }
              }
            `}
            </style>
            <Flex justify={"space-between"} mt={"sm"} align={"center"}>
              <Flex gap={"sm"}>
                <ActionIcon
                  variant="outline"
                  color="gray"
                  radius={"xl"}
                  size={"sm"}
                  onClick={() => {
                    textareaRef.current?.focus();
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                    }
                    setNormalInputMode(!normalInputMode);
                  }}
                >
                  {normalInputMode ? (
                    <IconArrowsMaximize size={"1rem"} />
                  ) : (
                    <IconArrowsMinimize size={"1rem"} />
                  )}
                </ActionIcon>
                {/* <ActionIcon variant="outline" color="gray" radius={"xl"} size={"sm"}>
                <IconPlus size={"1rem"} />
              </ActionIcon> */}
                {!attachedFile ? (
                  <ActionIcon
                    ml={"xl"}
                    variant="outline"
                    color="gray"
                    radius={"xl"}
                    size={"sm"}
                    onClick={() => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          console.log("File selected:", file.name);
                          dropzoneRef.current?.handleDrop(file);
                        }
                      };
                      fileInput.click();
                    }}
                  >
                    <Button ml="xl" color="grape" size="xs">
                      {"Add File"}
                      <IconPlus size={"1rem"} />
                    </Button>
                  </ActionIcon>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#e9ecef",
                      color: "#495057",
                      fontSize: "0.875rem",
                      whiteSpace: "nowrap",
                      border: "2px solid #adb5bd",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <IconFile
                      size={"1rem"}
                      style={{ marginRight: "8px", color: "#6c757d" }}
                    />
                    <Text fw={500} size={"xs"} style={{ marginRight: "8px" }}>
                      {attachedFile.name.length > 30
                        ? attachedFile.name.substring(0, 30) + "..."
                        : attachedFile.name}
                    </Text>
                    <ActionIcon
                      variant="outline"
                      color="gray"
                      radius={"xl"}
                      size={"xs"}
                      onClick={() => setAttachedFile(null)}
                      sx={{
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <IconX size={"1rem"} />
                    </ActionIcon>
                  </div>
                )}
              </Flex>
              <Flex>
                <DeepGram
                  recording={recording}
                  setRecording={setRecording}
                  onTranscriptionChanged={(text) => {
                    setPrompt((prevPrompt: string) => {
                      const newPrompt = prevPrompt + text;
                      promptRef.current = newPrompt;
                      setTimeout(() => {
                        const textarea = document.querySelector("textarea");
                        if (textarea) {
                          textarea.scrollTop = textarea.scrollHeight;
                        }
                      }, 0);
                      return newPrompt;
                    });
                  }}
                />
                <Button
                  size={"xs"}
                  disabled={prompt.trim().length === 0}
                  variant="filled"
                  className="bg-[#E25DEE] hover:bg-[#E25DEE]/80"
                  onClick={() => {
                    handleSubmit(
                      undefined,
                      undefined,
                      sendAsSelix,
                      sendSlack,
                      sendEmail,
                      scheduleDay
                    );
                    setRecording(false);
                    setScheduleDay(undefined);
                    setIntendedTaskChange(undefined);
                    props.setAttachedInternalTask(undefined);
                  }}
                  // leftIcon={<IconSend size={"1rem"} />}
                >
                  {" "}
                  {"Send"}
                  <Flex ml={"xs"} align="center" gap="1px">
                    <Kbd size={"xs"} style={{ color: "purple" }}>
                      ⌘
                    </Kbd>
                    {"+"}
                    <Kbd size={"xs"} style={{ color: "purple" }}>
                      ↩
                    </Kbd>
                  </Flex>
                </Button>
              </Flex>
            </Flex>
          </Paper>
          <Flex align="center" gap="0.5rem">
            <ActionIcon
              size="sm"
              onClick={() => {
                const url = `/selix_debugger?session_id=${sessionId}`;
                window.open(url, "_blank");
              }}
            >
              <IconSettings size={"1rem"} />
            </ActionIcon>
            {isInternal && (
              <>
                <Switch
                  size="sm"
                  color="grape"
                  checked={sendAsSelix}
                  onChange={() => {
                    const newSendAsSelix = !sendAsSelix;
                    setSendAsSelix(newSendAsSelix);
                    if (!newSendAsSelix) {
                      setSendEmail(false);
                      setSendSlack(false);
                    }
                  }}
                  label="As Selix"
                  labelPosition="right"
                  styles={{
                    label: { color: "grape" },
                  }}
                />
                {sendAsSelix && (
                  <>
                    <Checkbox
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                      label={<IconMail stroke={2.5} color="black" />}
                      size="sm"
                      mr="xs"
                      mt="xs"
                      color="grape"
                    />
                    <Checkbox
                      checked={sendSlack}
                      onChange={() => setSendSlack(!sendSlack)}
                      label={
                        <img
                          src={SlackLogo}
                          alt="slack"
                          width={20}
                          height={20}
                        />
                      }
                      size="sm"
                      color="grape"
                    />
                    <Popover
                      position="bottom"
                      withArrow
                      shadow="md"
                      trapFocus
                      opened={showSchedulePopup}
                    >
                      <Popover.Target>
                        <Tooltip
                          label="Schedule a send time into the future"
                          withArrow
                          withinPortal
                        >
                          <Flex>
                            <Button
                              onClick={() => setShowSchedulePopup((v) => !v)}
                              size="xs"
                            >
                              <IconClock24 size={"1rem"} />
                            </Button>
                          </Flex>
                        </Tooltip>
                      </Popover.Target>

                      <Popover.Dropdown>
                        <Calendar
                          placeholder={"Select a date"}
                          minDate={moment(new Date()).add(0, "days").toDate()}
                          getDayProps={(date) => ({
                            selected: moment(scheduleDay).isSame(date, "day"),
                            onClick: () => {
                              // Preserve the time
                              const hour = moment(scheduleDay).hour();
                              const minute = moment(scheduleDay).minute();
                              const newDate = moment(date)
                                .set("hour", hour)
                                .set("minute", minute)
                                .toDate();
                              setScheduleDay(newDate);
                            },
                          })}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Flex
                          mt="xs"
                          direction="row"
                          justify={"space-between"}
                          align="flex-end"
                        >
                          <TimeInput
                            w="100%"
                            label="Custom Time"
                            size="sm"
                            value={moment(scheduleDay).format("HH:mm")}
                            onChange={(event) => {
                              const value = event.currentTarget.value; // Format is HH:MM
                              const hour = parseInt(value.split(":")[0]);
                              const minute = parseInt(value.split(":")[1]);
                              const newDate = moment(scheduleDay)
                                .set("hour", hour)
                                .set("minute", minute)
                                .toDate();
                              setScheduleDay(newDate);
                            }}
                          />
                          <Tooltip
                            label="Schedule for now"
                            withArrow
                            withinPortal
                          >
                            <Flex>
                              <Button
                                size="xs"
                                mb="xs"
                                ml="sm"
                                variant="transparent"
                                color="red"
                                onClick={() => {
                                  setShowSchedulePopup(false);
                                  setScheduleDay(undefined);
                                }}
                              >
                                <IconX size="1rem" />
                              </Button>
                            </Flex>
                          </Tooltip>
                        </Flex>
                      </Popover.Dropdown>
                    </Popover>
                    {!attachedInternalTask ? (
                      <Droppable droppableId="droppable-area">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={{
                              border: snapshot.isDraggingOver
                                ? "1px solid #4caf50"
                                : "1px dashed #ccc",
                              padding: "10px",
                              marginLeft: "5px",
                              height: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: snapshot.isDraggingOver
                                ? "#f0fff0"
                                : "transparent",
                              overflow: "hidden", // Changed from "auto" to "hidden" to prevent expansion
                            }}
                            onDragEnter={(event) => {
                              console.log("Drag Enter event:", event);
                            }}
                            onDragOver={(event) => {
                              console.log("Drag Over event:", event);
                              event.preventDefault();
                            }}
                            onDragLeave={(event) => {
                              console.log("Drag Leave event:", event);
                            }}
                            onDrop={(event) => {
                              console.log("Drop event:", event);
                              event.preventDefault();
                              const data = event.dataTransfer.getData("text");
                              console.log("Dropped item:", data);
                              alert("Dropped item: " + data);
                            }}
                            onMouseEnter={(event) => {
                              console.log("Mouse entered droppable area");
                            }}
                            onMouseLeave={() => {
                              console.log("Mouse left droppable area");
                            }}
                          >
                            <Tooltip
                              label="Drag task here to attach"
                              withArrow
                              withinPortal
                            >
                              <Flex>
                                <IconChecklist size="1rem" />
                                {provided.placeholder}
                              </Flex>
                            </Tooltip>
                          </div>
                        )}
                      </Droppable>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <Text
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "#4caf50",
                            padding: "0px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginRight: "14px",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                          }}
                        >
                          {attachedInternalTask.title}
                        </Text>
                        <select
                          style={{
                            fontSize: "0.8rem",
                            marginTop: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "2px",
                            backgroundColor: "#f9f9f9",
                            width: "100%",
                          }}
                          onChange={(e) => {
                            setIntendedTaskChange(e.target.value);
                          }}
                        >
                          <option value="QUEUED">New Status: Queued</option>
                          <option value="IN_PROGRESS">
                            New Status: In Progress
                          </option>
                          <option value="IN_PROGRESS_REVIEW_NEEDED">
                            New Status: In Progress Review Needed
                          </option>
                          <option value="COMPLETE">New Status: Complete</option>
                          <option value="CANCELLED">
                            New Status: Cancelled
                          </option>
                          <option value="BLOCKED">New Status: Blocked</option>
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            cursor: "pointer",
                            color: "green",
                            fontSize: "0.8rem",
                            transition: "transform 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          onClick={(e) => {
                            props.setAttachedInternalTask(undefined);
                          }}
                        >
                          ✖
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Flex>
        </div>
      </Paper>
    </>
  );
};

const SelixControlCenter = ({
  attachedFile,
  setAIType,
  aiType,
  tasks,
  setTasks,
  recording,
  counter,
  messages,
  refreshAssetLibrary,
  setMessages,
  setPrompt,
  handleSubmit,
  threads,
  currentSessionId,
}: {
  setAIType: React.Dispatch<React.SetStateAction<string>>;
  attachedFile: File | null;
  aiType: string;
  refreshAssetLibrary: number;
  setTasks: React.Dispatch<React.SetStateAction<any>>;
  tasks: any;
  recording: boolean;
  threads: ThreadType[];
  counter: Number;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  currentSessionId: Number | null;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
}) => {
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const currentThreadMemory = threads.find(
    (thread) => thread.id === currentSessionId
  )?.memory;
  const [popoverOpenedArray, setPopoverOpenedArray] = useState<boolean[]>(
    [1, 1, 1, 1]?.map(() => false)
  );
  const userToken = useRecoilValue(userTokenState);

  const [showICPModal, setShowICPModal] = useState(false);
  const [refreshIcp, setRefreshIcp] = useState(false);

  const [availableCitations, setAvailableCitations] = useState<string[]>([]);
  const handlePopoverOpen = (index: number) => {
    setPopoverOpenedArray(popoverOpenedArray.map((opened, i) => i === index));
  };

  const handlePopoverClose = () => {
    setPopoverOpenedArray(popoverOpenedArray.map(() => false));
  };

  useEffect(() => {
    if (currentThreadMemory?.search) {
      const citations = currentThreadMemory.search.flatMap(
        (searchItem) => searchItem.citations
      );
      if (JSON.stringify(citations) !== JSON.stringify(availableCitations)) {
        setAvailableCitations(citations);
        setSelectedCitation(citations[0]);
      }
    }
  }, [{ ...threads }]);

  return (
    <Paper withBorder shadow="sm" w={"60%"} radius={"md"}>
      <Modal
        opened={showICPModal}
        onClose={() => {
          setShowICPModal(false);
          setRefreshIcp(!refreshIcp);
        }}
        fullScreen
        pt={0}
        zIndex={10000}
        sx={{
          float: "left",
        }}
      >
        <SellScaleAssistant
          refresh={refreshIcp}
          onEditClicked={() => {
            setShowICPModal(false);
          }}
          onEditClosed={() => {
            setRefreshIcp(!refreshIcp);
            setShowICPModal(false);
          }}
        />
      </Modal>
      <Flex
        px={"md"}
        py={"xs"}
        align={"center"}
        gap={5}
        bg={"#E25DEE"}
        className=" rounded-t-md"
      >
        <IconSparkles size={"1rem"} color="white" />
        <Text fw={600} color="white">
          Selix AI Workspace
        </Text>
        {recording && aiType === "STRATEGY_CREATOR" && (
          <IconEar
            size={"1rem"}
            color="white"
            style={{
              animation: "scale 1s infinite",
            }}
          />
        )}
      </Flex>
      <Divider bg="gray" />
      <Paper withBorder radius={0} p={"sm"}>
        <SegmentedControl
          value={aiType}
          onChange={(value) => {
            if (value === "BROWSER" && availableCitations.length === 0) {
              return;
            }
            setAIType(value);
            fetch(`${API_URL}/selix/set_session_tab`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                session_id: currentSessionId,
                tab: value,
              }),
            });
          }}
          w={"100%"}
          styles={{
            root: {
              backgroundColor: "transparent",
            },
            control: {
              borderWidth: "0px",
              "&:not(:last-of-type)": {
                borderWidth: "0px",
              },
            },
          }}
          data={[
            {
              value: "PLANNER",
              label: (
                <Popover
                  position="bottom"
                  withinPortal
                  withArrow
                  shadow="md"
                  width={200}
                  offset={10}
                  onClose={handlePopoverClose}
                  keepMounted
                  transitionProps={{ duration: 150, transition: "fade" }}
                  middlewares={{ shift: true, flip: true }}
                  arrowSize={10}
                  arrowOffset={5}
                  arrowRadius={2}
                  arrowPosition="center"
                  zIndex={1000}
                  radius="md"
                  opened={popoverOpenedArray[1]}
                >
                  <Popover.Target>
                    <div
                      onMouseEnter={() => handlePopoverOpen(1)}
                      onMouseLeave={handlePopoverClose}
                    >
                      <Center style={{ gap: 10 }}>
                        <IconList size={"1rem"} />
                        <span>Tasks</span>
                      </Center>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                    <Text size="sm">
                      This section allows you to view your tasks.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              ),
            },
            {
              value: "STRATEGY_CREATOR",
              label: (
                <Popover
                  position="bottom"
                  withinPortal
                  withArrow
                  shadow="md"
                  width={200}
                  offset={10}
                  onClose={handlePopoverClose}
                  keepMounted
                  transitionProps={{ duration: 150, transition: "fade" }}
                  middlewares={{ shift: true, flip: true }}
                  arrowSize={10}
                  arrowOffset={5}
                  arrowRadius={2}
                  arrowPosition="center"
                  zIndex={1000}
                  radius="md"
                  opened={popoverOpenedArray[0]}
                >
                  <Popover.Target>
                    <div
                      onMouseEnter={() => handlePopoverOpen(0)}
                      onMouseLeave={handlePopoverClose}
                    >
                      <Center style={{ gap: 10 }}>
                        <IconHammer size={"1rem"} />
                        <span>Task Plan</span>
                      </Center>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                    <Text size="sm">
                      This section allows you to manage your project's task
                      plan.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              ),
            },
            {
              value: "FILES",
              label: (
                <Popover
                  position="bottom"
                  withinPortal
                  withArrow
                  shadow="md"
                  width={200}
                  offset={10}
                  onClose={handlePopoverClose}
                  keepMounted
                  transitionProps={{ duration: 150, transition: "fade" }}
                  middlewares={{ shift: true, flip: true }}
                  arrowSize={10}
                  arrowOffset={5}
                  arrowRadius={2}
                  arrowPosition="center"
                  zIndex={1000}
                  radius="md"
                  opened={popoverOpenedArray[4]}
                >
                  <Popover.Target>
                    <div
                      onMouseEnter={() => handlePopoverOpen(4)}
                      onMouseLeave={handlePopoverClose}
                    >
                      <Center style={{ gap: 10 }}>
                        <IconFile size={"1rem"} />
                        <span>Files</span>
                      </Center>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                    <Text size="sm">View your files attached to the chat.</Text>
                  </Popover.Dropdown>
                </Popover>
              ),
            },
            {
              value: "BROWSER",
              label: (
                <Popover
                  position="bottom"
                  withinPortal
                  withArrow
                  shadow="md"
                  opened={popoverOpenedArray[2]} // Assuming this is the second popover
                  offset={10}
                  onPositionChange={(position) =>
                    console.log("Popover position:", position)
                  }
                  // positionDependencies={[selectedSubject]}
                  onClose={handlePopoverClose}
                  onOpen={() => handlePopoverOpen(2)}
                  keepMounted
                  transitionProps={{ duration: 150, transition: "fade" }}
                  width="auto"
                  middlewares={{ shift: true, flip: true }}
                  arrowSize={10}
                  arrowOffset={5}
                  arrowRadius={2}
                  arrowPosition="center"
                  zIndex={1000}
                  radius="md"
                >
                  <Popover.Target>
                    <div
                      onMouseEnter={() => handlePopoverOpen(2)}
                      onMouseLeave={handlePopoverClose}
                    >
                      <Center style={{ gap: 10 }}>
                        <IconBrowser size={"1rem"} />
                        <span>Browser</span>
                      </Center>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                    <Text size="sm">
                      Controlled by chat, view for Selix AI research.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              ),
            },
            {
              value: "ICP",
              label: (
                <div
                  onMouseEnter={() => handlePopoverOpen(3)}
                  onMouseLeave={handlePopoverClose}
                  // onClick={() => setShowICPModal(true)}
                >
                  <Center style={{ gap: 10 }}>
                    <IconFlask size={"1rem"} />
                    <span>ICP</span>
                  </Center>
                </div>
              ),
            },
            {
              value: "ASSETS",
              label: (
                <div
                  onMouseEnter={() => handlePopoverOpen(3)}
                  onMouseLeave={handlePopoverClose}
                  // onClick={() => setShowICPModal(true)}
                >
                  <Center style={{ gap: 10 }}>
                    <IconArchive size={"1rem"} />
                    <span>Assets</span>
                  </Center>
                </div>
              ),
            },
          ]}
        />
      </Paper>
      <ScrollArea h={"87%"} scrollHideDelay={4000}>
        {aiType === "STRATEGY_CREATOR" ? (
          <SelinStrategy
            counter={counter}
            messages={messages}
            threads={threads}
            currentSessionId={currentSessionId}
            setPrompt={setPrompt}
            handleSubmit={handleSubmit}
          />
        ) : aiType === "PLANNER" ? (
          // passing in messages length to trigger renders
          <PlannerComponent
            setTasks={setTasks}
            counter={counter}
            messagesLength={messages.length}
            threads={threads}
            tasks={tasks}
            currentSessionId={currentSessionId}
            handleStrategySubmit={handleSubmit}
          />
        ) : aiType === "segment" ? (
          <Box maw="900px">
            <SegmentV3 />
          </Box>
        ) : aiType === "campaign" ? (
          <Box maw="100%">
            <CampaignLandingV2 />
          </Box>
        ) : aiType === "analytics" ? (
          <Box maw="900px">
            <WhatHappenedLastWeek />
          </Box>
        ) : aiType === "BROWSER" ? (
          <Box maw="100%">
            <Select
              value={selectedCitation}
              data={availableCitations}
              placeholder="Select a citation"
              onChange={(value) => setSelectedCitation(value)}
            />

            <iframe
              src={selectedCitation || undefined}
              style={{
                width: "100%",
                height: "calc(100% - 50px)",
                border: "none",
                position: "absolute",
                top: "50px",
                left: 0,
              }}
            />
          </Box>
        ) : aiType === "NOT_AVAILABLE" ? (
          <Center style={{ height: "100%" }}>
            <Text style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
              Not Currently Available.
            </Text>
          </Center>
        ) : aiType === "NOT_AVAILABLE2" || aiType === "NOT_AVAILABLE3" ? (
          <Center style={{ height: "100%" }}>
            <Text style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
              Not Currently Available.
            </Text>
          </Center>
        ) : aiType === "ICP" ? (
          <SellScaleAssistant showChat={false} refresh={refreshIcp} />
        ) : aiType === "FILES" ? (
          <FilesComponent
            attachedFile={attachedFile}
            currentSessionId={currentSessionId}
          />
        ) : aiType === "ASSETS" ? (
          <AssetLibraryV2 key={refreshAssetLibrary} />
        ) : (
          <Center style={{ height: "100%" }}>
            <Text style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
              No Tasks Created. Please create one via the chat.
            </Text>
          </Center>
        )}

        {aiType === "STRATEGY_CREATOR" ? (
          <Paper
            withBorder
            bg={"#fffaea"}
            mt={"sm"}
            px={"sm"}
            py={"xs"}
            style={{ borderColor: "#fdb93a" }}
          >
            <Flex align={"center"} gap={"xs"}>
              <IconInfoCircle color="orange" size={"1rem"} />
              <Text size={"xs"} color="orange" fw={600}>
                Disclaimer:{" "}
                <span className="font-medium">
                  Once executed, I will draft the campaign. You can review your
                  campaign prior to any outreach.
                </span>
              </Text>
            </Flex>
          </Paper>
        ) : aiType === "PLANNER" ? (
          <></>
        ) : (
          // <Paper withBorder bg={"#fffaea"} mt={"sm"} px={"sm"} py={"md"} style={{ borderColor: "#fdb93a" }}>
          //   <Flex align={"center"} gap={"xs"} justify={"space-between"}>
          //     <Text size={"sm"} color="orange" fw={600}>
          //       Would you like to confirm the task lis tbefore getting started with Task Plan?
          //     </Text>
          //     <Flex gap={4}>
          //       <Button variant="outline" color="orange" w={100} size="xs">
          //         No
          //       </Button>
          //       <Button variant="filled" color="orange" w={100} size="xs">
          //         Yes
          //       </Button>
          //     </Flex>
          //   </Flex>
          // </Paper>
          <></>
        )}
      </ScrollArea>
    </Paper>
  );
};

// const TimelineComponent = () => {
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
//     setScrollPosition(event.currentTarget.scrollLeft);
//   };

//   const generateTimelineData = () => {
//     const data = [];
//     for (let hour = 0; hour <= 24; hour++) {
//       for (let minute = 0; minute < 60; minute += 10) {
//         data.push({
//           time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
//           isMainGraduation: minute === 0,
//           label: minute === 0 ? `${hour.toString().padStart(2, "0")}:00` : "",
//         });
//       }
//     }
//     return data;
//   };

//   const timelineData = generateTimelineData();

//   let isDown = false;
//   let startX: number;
//   let scrollLeft: number;

//   useEffect(() => {
//     const handleMouseDown = (e: MouseEvent) => {
//       isDown = true;
//       startX = e.pageX - (containerRef.current?.offsetLeft || 0);
//       scrollLeft = containerRef.current?.scrollLeft || 0;
//     };

//     const handleMouseLeave = () => {
//       isDown = false;
//     };

//     const handleMouseUp = () => {
//       isDown = false;
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDown) return;
//       e.preventDefault();
//       const x = e.pageX - (containerRef.current?.offsetLeft || 0);
//       const walk = (x - startX) * 3;
//       if (containerRef.current) {
//         containerRef.current.scrollLeft = scrollLeft - walk;
//       }
//     };

//     const container = containerRef.current;

//     container?.addEventListener("mousedown", handleMouseDown);
//     container?.addEventListener("mouseleave", handleMouseLeave);
//     container?.addEventListener("mouseup", handleMouseUp);
//     container?.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       container?.removeEventListener("mousedown", handleMouseDown);
//       container?.removeEventListener("mouseleave", handleMouseLeave);
//       container?.removeEventListener("mouseup", handleMouseUp);
//       container?.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return (
//     <Paper withBorder p="md" mt="md">
//       <Flex align={"center"} justify={"space-between"}>
//         <Flex gap={"sm"}>
//           <ActionIcon size={"sm"} variant="outline" color="gray" radius={"sm"}>
//             <IconChevronLeft />
//           </ActionIcon>
//           <ActionIcon size={"sm"} variant="outline" color="gray" radius={"sm"}>
//             <IconChevronRight />
//           </ActionIcon>
//         </Flex>
//         <Badge variant="outline">Go Live</Badge>
//       </Flex>
//       <div className="relative flex justify-center mt-4">
//         <div className="absolute top-[-15px]">
//           <IconTriangleInverted size={"1rem"} fill="gray" color="white" />
//         </div>
//         <div
//           className="absolute left-0 top-[-10px] h-[50px] w-[120px]"
//           style={{
//             backgroundImage: "linear-gradient(90deg, white, transparent)",
//           }}
//         ></div>
//         <div
//           className="absolute right-0 top-[-10px] h-[50px] w-[120px]"
//           style={{
//             backgroundImage: "linear-gradient(90deg, transparent, white)",
//           }}
//         ></div>
//       </div>
//       <div
//         ref={containerRef}
//         style={{
//           overflowX: "hidden",
//           whiteSpace: "nowrap",
//           paddingBottom: "10px",
//           borderTop: "1px solid #ced4da",
//         }}
//         onScroll={handleScroll}
//         className="mx-4"
//       >
//         <Flex w={"100%"} gap={"sm"}>
//           {timelineData.map((item, index) => {
//             return (
//               <>
//                 {index < timelineData.length - 5 && (
//                   <Flex key={index} direction={"column"} align={"center"} w={item.isMainGraduation ? "2px" : "10px"}>
//                     <div
//                       style={{
//                         height: item.isMainGraduation ? "15px" : "8px",
//                         width: item.isMainGraduation ? "2px" : "1px",
//                         backgroundColor: "#ced4da",
//                       }}
//                       onClick={() => {
//                         const newPosition = index * 25;
//                         containerRef.current?.scrollTo({
//                           left: newPosition,
//                           behavior: "smooth",
//                         });
//                       }}
//                     />
//                     {item.label && (
//                       <Text size="xs" color="dimmed" ml={index === 0 ? "45px" : ""} mr={index === timelineData.length - 6 ? "46px" : ""}>
//                         {item.label}
//                       </Text>
//                     )}
//                   </Flex>
//                 )}
//               </>
//             );
//           })}
//         </Flex>
//       </div>
//     </Paper>
//   );
// };

export const PlannerComponent = ({
  threads,
  counter,
  currentSessionId,
  messagesLength,
  tasks,
  setTasks,
  handleStrategySubmit,
  isTimeline,
}: {
  threads: ThreadType[];
  currentSessionId: Number | null;
  messagesLength: number;
  setTasks: React.Dispatch<React.SetStateAction<any>>;
  tasks: TaskType[];
  counter: Number;
  handleStrategySubmit: () => void;
  isTimeline?: boolean;
}) => {
  const [opened, { toggle }] = useDisclosure(true);
  const taskContainerRef = useRef<HTMLDivElement>(null);
  const [openedTaskIndex, setOpenedTaskIndex] = useState<number | null>(null);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const userToken = useRecoilValue(userTokenState);
  const [showRewindImage, setShowRewindImage] = useState(false);
  const [showAutoExecutionModal, setShowAutoExecutionModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Number | null>(null);
  const [creatingNewTask, setCreatingNewTask] = useState(false);
  const [editingTaskText, setEditingTaskText] = useState<string>(""); // title
  const taskDraftDescriptionRaw = useRef<JSONContent | string>();
  const taskDraftDescription = useRef<string>("");

  const [selectedRewindImage, setSelectedRewindImage] = useState<string>("");
  const [segment, setSegment] = useState<TransformedSegment | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const isInternal = window.location.href.includes("internal");

  const campaignId = threads.find((thread) => thread.id === currentSessionId)
    ?.memory?.campaign_id;

  const currentThread = threads.find(
    (thread) => thread.id === currentSessionId
  );

  const fetchSelixLogs = async (
    selixLogId: number | null = null
  ): Promise<MemoryLog[]> => {
    try {
      const response = await fetch(`${API_URL}/selix/get_selix_logs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          ContentType: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const result = await response.json();

      console.log("Logs fetched successfully");

      return result.logs;
    } catch (error) {
      console.error("Error fetching logs:", error);
      return [] as MemoryLog[];
    }
  };

  const { data: logs, refetch } = useQuery({
    queryKey: ["selix_event_logs_planner_component"],
    queryFn: async () => {
      let l: MemoryLog[] = await fetchSelixLogs();
      l = l
        .filter((log) => {
          if (currentSessionId) {
            if (!log.session_id) {
              return false;
            }

            return (
              log.show_in_session_memory &&
              +log.session_id === +currentSessionId
            );
          } else {
            return log.show_in_session_memory;
          }
        })
        .reverse();

      setSelectedLog(l[0]);

      return l;
    },
  });

  const [selectedLog, setSelectedLog] = useState<MemoryLog | null>(null);

  const updateTask = async (
    taskId: number,
    title: string,
    description: string,
    status: string,
    widget_type: string | undefined
  ) => {
    if (widget_type === "") widget_type = undefined;

    try {
      const response = await fetch(`${API_URL}/selix/update-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          taskId,
          title,
          description,
          status,
          widgetType: widget_type,
        }),
      });

      if (!response.ok) {
        showNotification({
          color: "red",
          title: "Error",
          message: "Failed to update task",
        });
        throw new Error("Failed to update task");
      }

      const data = await response.json();
      console.log("Task updated successfully:", data);

      queryClient.invalidateQueries(["selix_event_logs_planner_component"]);

      showNotification({
        color: "green",
        title: "Success",
        message: "Task updated successfully",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    if (openedTaskIndex === tasks.length - 1) {
      setTimeout(() => {
        taskContainerRef.current?.scrollTo({
          top: taskContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  }, [openedTaskIndex, tasks.length]);

  useEffect(() => {
    (async () => {
      if (campaignId) {
        const [project, res] = await Promise.all([
          getFreshCurrentProject(userToken, campaignId),
          getSegments(true, false, campaignId),
        ]);

        setSegment(res[0] || undefined);
        setCurrentProject(project);

        if (currentThread?.tasks.length) {
          setOpenedTaskIndex(currentThread?.tasks.length - 1);
        }
        setTimeout(() => {
          if (taskContainerRef.current) {
            taskContainerRef.current.scrollTo({
              top: taskContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 50);
        //show the 'launch campaign' task if a campaign is attached
      }
    })();
  }, [campaignId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (taskContainerRef.current) {
        taskContainerRef.current.scrollTo({
          top: taskContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100); // Adjust the timeout duration as needed

    return () => clearTimeout(timeoutId);
  }, [tasks.length]);

  const getSegments = async (
    includeAllInClient: boolean = true,
    tagFilter: boolean = false,
    forceCampaignId: number
  ) => {
    const url = new URL(`${API_URL}/segment/all`);
    if (includeAllInClient) {
      if (currentProject?.id !== undefined) {
        url.searchParams.append("archetype_id", forceCampaignId.toString());
      }
      url.searchParams.append("include_all_in_client", "true");
    }
    if (tagFilter) {
      url.searchParams.append("tag_filter", "true");
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    // setIsLoading(false);
    return data.segments;
  };

  const valueMapping = useMemo(() => {
    if (!logs || logs.length === 0) {
      return [];
    }

    const step = Math.floor(100 / Math.max(logs.length - 1, 1));

    let reversedLogs = [...logs].reverse();

    return reversedLogs.map((item, index) => {
      return {
        id: item.id,
        value: step * index,
      };
    });
  }, [logs]);

  console.log(valueMapping);

  const onDragEnd = async (result: {
    destination: { index: number };
    source: { index: number };
  }) => {
    if (!isInternal) {
      return;
    }
    if (!result.destination) {
      return;
    }
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Update the state with the reordered tasks
    setTasks(reorderedTasks);

    // Call the API to reorder the tasks
    try {
      const response = await fetch(`${API_URL}/selix/reorder-tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          tasks: reorderedTasks.map((task, index) => ({
            id: task.id,
            order: index,
          })),
        }),
      });

      if (!response.ok) {
        console.error("Failed to reorder tasks");
      }
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  return (
    <Paper p={"sm"} radius={"sm"}>
      <Flex direction={"column"} gap={"4px"}>
        <Paper
          bg={"#fefafe"}
          my={"sm"}
          px={"sm"}
          py={8}
          style={{ borderColor: "#fadafc" }}
        >
          <Flex align={"center"} gap={"xs"} justify={"space-between"}>
            {currentProject &&
              currentThread?.memory.campaign_id === currentProject?.id && (
                <Text size={"xs"} color="#E25DEE" fw={600}>
                  Selix Tasks:{" "}
                  <span className="font-medium text-gray-500">
                    {currentProject.name}{" "}
                    <a
                      href={`/campaign_v2/${currentProject.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "5px" }}
                    >
                      <IconExternalLink size="0.8rem" />
                    </a>
                  </span>
                </Text>
              )}
            {threads.find((thread) => thread.id === currentSessionId)
              ?.estimated_completion_time && (
              <Flex gap={5} align={"center"}>
                <Divider orientation="vertical" color={"#fceafe"} />
                {threads.find((thread) => thread.id === currentSessionId)
                  ?.estimated_completion_time ? (
                  (() => {
                    const now = moment();
                    const estimatedCompletion = moment(
                      threads.find((thread) => thread.id === currentSessionId)
                        ?.estimated_completion_time
                    );
                    const duration = moment.duration(
                      estimatedCompletion.diff(now)
                    );
                    const hours = Math.floor(duration.asHours());
                    const minutes = duration.minutes();

                    if (hours < 0 || minutes < 0) {
                      return (
                        <Text size={"xs"} className="text-gray-500">
                          --
                        </Text>
                      );
                    }

                    return (
                      <>
                        <Text size={"xs"} className="text-gray-500">
                          Estimated completion time:
                        </Text>
                        <ThemeIcon
                          bg="#fceafe"
                          variant="light"
                          className="text-[#E25DEE]"
                        >
                          {hours}
                        </ThemeIcon>
                        <Text color="#E25DEE"> hours, </Text>
                        <ThemeIcon
                          bg="#fceafe"
                          variant="light"
                          className="text-[#E25DEE]"
                        >
                          {minutes}
                        </ThemeIcon>
                        <Text color="#E25DEE"> minutes</Text>
                      </>
                    );
                  })()
                ) : (
                  <Text size={"xs"} className="text-gray-500">
                    Estimated completion time: --
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Paper>

        <SelixAutoExecuteModal
          onClose={() => setShowAutoExecutionModal(false)}
          opened={showAutoExecutionModal}
        />

        <Modal
          opened={showRewindImage}
          onClose={() => setShowRewindImage(false)}
          title="Rewind Image"
        >
          <img
            src={selectedRewindImage}
            alt="Rewind"
            width={"100%"}
            height={"100%"}
            style={{ marginTop: "10px" }}
          />
        </Modal>
        <ScrollArea
          h={isTimeline ? "200px" : "650px"}
          scrollHideDelay={4000}
          style={{
            overflow: "hidden",
          }}
          viewportRef={taskContainerRef}
        >
          {selectedLog &&
          logs?.findIndex((value) => value.id === selectedLog.id) !== 0 &&
          selectedLog.json_data?.tasks &&
          selectedLog.json_data.tasks.length > 0 ? (
            selectedLog.json_data.tasks.map((task: TaskType, index: number) => {
              // index = array.length - 1 - index;
              const SelixSessionTaskStatus = {
                QUEUED: "QUEUED",
                IN_PROGRESS: "IN_PROGRESS",
                IN_PROGRESS_REVIEW_NEEDED: "IN_PROGRESS_REVIEW_NEEDED",
                COMPLETE: "COMPLETE",
                CANCELLED: "CANCELLED",
                BLOCKED: "BLOCKED",
              };

              const statusColors = {
                [SelixSessionTaskStatus.QUEUED]: "blue",
                [SelixSessionTaskStatus.IN_PROGRESS]: "orange",
                [SelixSessionTaskStatus.IN_PROGRESS_REVIEW_NEEDED]: "orange",
                [SelixSessionTaskStatus.COMPLETE]: "green",
                [SelixSessionTaskStatus.CANCELLED]: "gray",
                [SelixSessionTaskStatus.BLOCKED]: "red",
              };

              const humanReadableStatus = {
                [SelixSessionTaskStatus.QUEUED]: "Queued",
                [SelixSessionTaskStatus.IN_PROGRESS]: "In Progress",
                [SelixSessionTaskStatus.IN_PROGRESS_REVIEW_NEEDED]:
                  "In Progress",
                [SelixSessionTaskStatus.COMPLETE]: "Complete",
                [SelixSessionTaskStatus.CANCELLED]: "Cancelled",
                [SelixSessionTaskStatus.BLOCKED]: "⚠️ Blocked",
              };

              return (
                <Paper withBorder p={"sm"} mb={"xs"} radius={"md"}>
                  <Flex justify={"space-between"} align={"center"} p={"4px"}>
                    <Text
                      className="flex gap-1 items-center"
                      fw={600}
                      size={"sm"}
                    >
                      <ThemeIcon
                        color="gray"
                        radius={"xl"}
                        variant="light"
                        size={18}
                      >
                        {index + 1}
                      </ThemeIcon>
                      {task.title}
                    </Text>
                    <Flex align={"center"} gap={"xs"}>
                      <Tooltip
                        label={
                          !task.rewind_img
                            ? "No rewind available"
                            : "View rewind"
                        }
                      >
                        <Button
                          size={"xs"}
                          variant="outline"
                          color={task.rewind_img ? "blue" : "gray"}
                          leftIcon={<IconHistory size={14} />}
                          sx={{
                            opacity: task.rewind_img ? 1 : 0.3,
                          }}
                          onClick={() => {
                            if (task.rewind_img) {
                              setShowRewindImage(true);
                              setSelectedRewindImage(task.rewind_img);
                            }
                          }}
                        >
                          Rewind
                        </Button>
                      </Tooltip>
                      <Text color="gray" size={"sm"} fw={500}>
                        {/* {moment(task.created_at).format("MM/DD/YY, h:mm a")} */}
                      </Text>

                      <Flex align={"center"} gap={"xs"} w={100}>
                        <ThemeIcon
                          color={statusColors[task.status]}
                          radius={"xl"}
                          size={10}
                        >
                          <span />
                        </ThemeIcon>
                        <Text
                          color={statusColors[task.status]}
                          size={"sm"}
                          fw={500}
                        >
                          {humanReadableStatus[task.status]}
                        </Text>
                      </Flex>

                      <ActionIcon
                        onClick={() =>
                          setOpenedTaskIndex(
                            openedTaskIndex === index ? null : index
                          )
                        }
                      >
                        {openedTaskIndex === index ? (
                          <IconChevronUp size={"1rem"} />
                        ) : (
                          <IconChevronDown size={"1rem"} />
                        )}
                      </ActionIcon>
                    </Flex>
                  </Flex>
                  <Collapse in={openedTaskIndex === index}>
                    <Text p={"xs"} mt={"sm"} size="xs">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            task.description?.replaceAll("\n", "<br />") || "",
                        }}
                      />
                    </Text>
                  </Collapse>
                </Paper>
              );
            })
          ) : (
            <>
              <Droppable isDropDisabled={!isInternal} droppableId="tasks">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      ?.filter(
                        (task: TaskType, index: number, self: any) =>
                          task.selix_session_id === currentSessionId
                      )
                      .map((task: TaskType, index: number, array) => {
                        // index = array.length - 1 - index;
                        const SelixSessionTaskStatus = {
                          QUEUED: "QUEUED",
                          IN_PROGRESS: "IN_PROGRESS",
                          IN_PROGRESS_REVIEW_NEEDED:
                            "IN_PROGRESS_REVIEW_NEEDED",
                          COMPLETE: "COMPLETE",
                          CANCELLED: "CANCELLED",
                          BLOCKED: "BLOCKED",
                        };

                        const statusColors = {
                          [SelixSessionTaskStatus.QUEUED]: "blue",
                          [SelixSessionTaskStatus.IN_PROGRESS]: "orange",
                          [SelixSessionTaskStatus.IN_PROGRESS_REVIEW_NEEDED]:
                            "orange",
                          [SelixSessionTaskStatus.COMPLETE]: "green",
                          [SelixSessionTaskStatus.CANCELLED]: "gray",
                          [SelixSessionTaskStatus.BLOCKED]: "red",
                        };

                        const humanReadableStatus = {
                          [SelixSessionTaskStatus.QUEUED]: "Queued",
                          [SelixSessionTaskStatus.IN_PROGRESS]: "In Progress",
                          [SelixSessionTaskStatus.IN_PROGRESS_REVIEW_NEEDED]:
                            "In Progress",
                          [SelixSessionTaskStatus.COMPLETE]: "Complete",
                          [SelixSessionTaskStatus.CANCELLED]: "Cancelled",
                          [SelixSessionTaskStatus.BLOCKED]: "⚠️ Blocked",
                        };

                        return (
                          <Draggable
                            key={task.id}
                            index={index}
                            draggableId={`task-${task.id}`}
                            isDragDisabled={!isInternal}
                          >
                            {(provided) => (
                              <Paper
                                withBorder
                                p={"sm"}
                                mb={"xs"}
                                radius={"md"}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Flex
                                  justify={"space-between"}
                                  align={"center"}
                                  p={"4px"}
                                >
                                  {editingTask === index ? (
                                    <Flex align="center" gap="xs" w={"60%"}>
                                      <Flex w="80%" gap="xs">
                                        <Input
                                          value={editingTaskText}
                                          onChange={(e) => {
                                            setEditingTaskText(e.target.value);
                                          }}
                                          autoFocus
                                          style={{ flexGrow: 1 }}
                                        />
                                        <NativeSelect
                                          value={task.widget_type}
                                          data={[
                                            {
                                              value: "",
                                              label: "Proof of Work (image)",
                                            },
                                            {
                                              value: "LAUNCH_CAMPAIGN",
                                              label: "Launch Campaign",
                                            },
                                            {
                                              value: "VIEW_STRATEGY",
                                              label: "View Strategy",
                                            },
                                            {
                                              value: "REVIEW_PROSPECTS",
                                              label: "Review Prospects",
                                            },
                                            {
                                              value: "VIEW_SEQUENCE",
                                              label: "View Sequence",
                                            },
                                            {
                                              value: "VIEW_PERSONALIZERS",
                                              label: "Campaign Personalizers",
                                            },
                                            {
                                              value: "REVIEW_COMPANIES",
                                              label: "Review Companies",
                                            },
                                            {
                                              value: "ONE_SHOT_GENERATOR",
                                              label: "One Shot Generator",
                                            },
                                            {
                                              value: "COMPANY_SEGMENT",
                                              label: "Company Segment",
                                            },
                                          ]}
                                          onChange={(e) => {
                                            const updatedTasks = [...tasks];
                                            updatedTasks[index].widget_type =
                                              e.currentTarget.value;
                                            setTasks(updatedTasks);
                                          }}
                                          style={{ width: "40%" }}
                                        />
                                      </Flex>
                                      <Badge
                                        color="green"
                                        style={{
                                          cursor: "pointer",
                                          whiteSpace: "nowrap",
                                        }}
                                        onClick={() => {
                                          setEditingTask(null);
                                          setTasks(
                                            tasks.map((t, i) =>
                                              i === index
                                                ? {
                                                    ...t,
                                                    title: editingTaskText,
                                                    description:
                                                      taskDraftDescription.current,
                                                  }
                                                : t
                                            )
                                          );
                                          updateTask(
                                            tasks[index].id,
                                            editingTaskText,
                                            taskDraftDescription.current,
                                            tasks[index].status,
                                            tasks[index].widget_type
                                          );
                                        }}
                                      >
                                        Save
                                      </Badge>
                                    </Flex>
                                  ) : (
                                    <Text
                                      className="flex gap-1 items-center"
                                      fw={600}
                                      size={"sm"}
                                    >
                                      <ThemeIcon
                                        color="gray"
                                        radius={"xl"}
                                        variant="light"
                                        size={18}
                                      >
                                        {index + 1}
                                      </ThemeIcon>
                                      {isInternal && (
                                        <Tooltip label="Drag to reorder">
                                          <ThemeIcon
                                            color="gray"
                                            radius={"xl"}
                                            variant="light"
                                            size={18}
                                            style={{ cursor: "grab" }}
                                          >
                                            <IconGripVertical size={14} />
                                          </ThemeIcon>
                                        </Tooltip>
                                      )}
                                      {isInternal && (
                                        <Tooltip label="Edit task">
                                          <ThemeIcon
                                            color="gray"
                                            radius={"xl"}
                                            variant="light"
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              setEditingTask(index);
                                              setOpenedTaskIndex(index);
                                              setEditingTaskText(task.title);
                                              taskDraftDescription.current =
                                                task?.description || "";
                                              taskDraftDescriptionRaw.current =
                                                task?.description || "";
                                            }}
                                            // onBlur={() => setEditingTask(null)}
                                          >
                                            <IconPencil size={14} />
                                          </ThemeIcon>
                                        </Tooltip>
                                      )}
                                      {task.title}
                                    </Text>
                                  )}
                                  <Flex align={"center"} gap={"xs"}>
                                    <Box w={"130px"}>
                                      {isInternal && (
                                        <Tooltip
                                          label={
                                            "Attempt automatic execution of task."
                                          }
                                        >
                                          <Button
                                            size={"xs"}
                                            w={"100%"}
                                            variant="outline"
                                            compact
                                            disabled={
                                              task.status !== "QUEUED" &&
                                              task.status !==
                                                "IN_PROGRESS_REVIEW_NEEDED" &&
                                              task.status !== "IN_PROGRESS"
                                            }
                                            color={"teal"}
                                            leftIcon={<IconBolt size={14} />}
                                            onClick={() => {
                                              setShowAutoExecutionModal(true);
                                            }}
                                          >
                                            Auto Execute
                                          </Button>
                                        </Tooltip>
                                      )}
                                      <Tooltip
                                        label={
                                          !task.rewind_img
                                            ? "No rewind available"
                                            : "View rewind"
                                        }
                                      >
                                        <Button
                                          size={"xs"}
                                          compact
                                          w={"100%"}
                                          variant="outline"
                                          color={
                                            task.rewind_img ? "blue" : "gray"
                                          }
                                          leftIcon={<IconHistory size={14} />}
                                          sx={{
                                            opacity: task.rewind_img ? 1 : 0.3,
                                          }}
                                          onClick={() => {
                                            if (task.rewind_img) {
                                              setShowRewindImage(true);
                                              setSelectedRewindImage(
                                                task.rewind_img
                                              );
                                            }
                                          }}
                                        >
                                          Rewind
                                        </Button>
                                      </Tooltip>
                                    </Box>
                                    <Text color="gray" size={"sm"} fw={500}>
                                      {/* {moment(task.created_at).format("MM/DD/YY, h:mm a")} */}
                                    </Text>
                                    {editingTask === index ? (
                                      <Select
                                        w={"140px"}
                                        value={task.status}
                                        onChange={(value) => {
                                          if (value !== null) {
                                            const updatedTasks = [...tasks];
                                            updatedTasks[index].status =
                                              value as
                                                | "QUEUED"
                                                | "IN_PROGRESS"
                                                | "IN_PROGRESS_REVIEW_NEEDED"
                                                | "COMPLETE"
                                                | "CANCELLED"
                                                | "BLOCKED";
                                            setTasks(updatedTasks);
                                          }
                                        }}
                                        data={Object.keys(
                                          humanReadableStatus
                                        ).map((status) => ({
                                          value: status,
                                          label: humanReadableStatus[status],
                                          customLabel: (
                                            <Flex align={"center"} gap={"xs"}>
                                              <ThemeIcon
                                                color={statusColors[status]}
                                                radius={"xl"}
                                                size={10}
                                              >
                                                <span />
                                              </ThemeIcon>
                                              <Text
                                                color={statusColors[status]}
                                                size={"sm"}
                                                fw={500}
                                              >
                                                {humanReadableStatus[status]}
                                              </Text>
                                            </Flex>
                                          ),
                                        }))}
                                        itemComponent={({
                                          value,
                                          label,
                                          ...others
                                        }) => <div {...others}>{label}</div>}
                                      />
                                    ) : (
                                      <Flex align={"center"} gap={"xs"} w={100}>
                                        <ThemeIcon
                                          color={statusColors[task.status]}
                                          radius={"xl"}
                                          size={10}
                                        >
                                          <span />
                                        </ThemeIcon>
                                        <Text
                                          color={statusColors[task.status]}
                                          size={"sm"}
                                          fw={500}
                                        >
                                          {humanReadableStatus[task.status]}
                                        </Text>
                                      </Flex>
                                    )}

                                    <ActionIcon
                                      onClick={() =>
                                        setOpenedTaskIndex(
                                          openedTaskIndex === index
                                            ? null
                                            : index
                                        )
                                      }
                                    >
                                      {openedTaskIndex === index ? (
                                        <IconChevronUp size={"1rem"} />
                                      ) : (
                                        <IconChevronDown size={"1rem"} />
                                      )}
                                    </ActionIcon>
                                    {isInternal && (
                                      <ActionIcon
                                        onClick={async () => {
                                          try {
                                            const response = await fetch(
                                              `${API_URL}/selix/task`,
                                              {
                                                method: "DELETE",
                                                headers: {
                                                  "Content-Type":
                                                    "application/json",
                                                  Authorization: `Bearer ${userToken}`,
                                                },
                                                body: JSON.stringify({
                                                  task_id: task.id,
                                                }),
                                              }
                                            );

                                            const data = await response.json();

                                            if (!response.ok) {
                                              throw new Error(
                                                data.error ||
                                                  "Failed to delete task"
                                              );
                                            }

                                            showNotification({
                                              color: "green",
                                              title: "Success",
                                              message: data.message,
                                            });
                                            setTasks(
                                              tasks.filter(
                                                (t, i) => i !== index
                                              )
                                            );
                                          } catch (error) {
                                            console.error(
                                              "Error deleting task:",
                                              error
                                            );
                                            showNotification({
                                              color: "red",
                                              title: "Error",
                                              message: "Failed to delete task",
                                            });
                                          }
                                        }}
                                        color="red"
                                      >
                                        <IconTrash size={"1rem"} />
                                      </ActionIcon>
                                    )}
                                  </Flex>
                                </Flex>
                                <Collapse in={openedTaskIndex === index}>
                                  <Text p={"xs"} mt={"sm"} size="xs">
                                    {editingTask === index ? (
                                      <RichTextArea
                                        overrideSticky={true}
                                        onChange={(value, rawValue) => {
                                          taskDraftDescriptionRaw.current =
                                            rawValue;
                                          taskDraftDescription.current = value;
                                        }}
                                        value={taskDraftDescriptionRaw.current}
                                        height={110}
                                      />
                                    ) : (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            task.description?.replaceAll(
                                              "\n",
                                              "<br />"
                                            ) || "",
                                        }}
                                      />
                                    )}
                                  </Text>
                                  {/* eventually delete this */}
                                  {currentThread?.memory.campaign_id &&
                                    openedTaskIndex === index && (
                                      <TaskRenderer
                                        // key={currentProject?.id}
                                        task={task}
                                        counter={counter}
                                        segment={segment}
                                        // messages={messages}
                                        threads={threads}
                                        currentSessionId={currentSessionId}
                                        handleStrategySubmit={
                                          handleStrategySubmit
                                        }
                                        setOpenedTaskIndex={setOpenedTaskIndex}
                                      />
                                    )}
                                </Collapse>
                              </Paper>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {isInternal && (
                <Flex justify="center" mt="md">
                  {creatingNewTask ? (
                    <Loader size="md" color="blue" />
                  ) : (
                    <Button
                      variant="light"
                      color="blue"
                      radius="md"
                      size="md"
                      onClick={async () => {
                        try {
                          setCreatingNewTask(true);
                          const response = await fetch(
                            `${API_URL}/selix/create-task-id`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${userToken}`,
                              },
                              body: JSON.stringify({
                                selix_session_id: currentSessionId,
                              }),
                            }
                          );

                          if (!response.ok) {
                            showNotification({
                              color: "red",
                              title: "Error",
                              message: "Failed to create new task",
                            });
                          }
                          setCreatingNewTask(false);

                          const newTask: TaskType = await response.json();

                          setTasks([...tasks, newTask]);
                          setEditingTask(tasks.length);
                          setEditingTaskText(newTask.title);
                          taskDraftDescription.current =
                            newTask.description || "";
                          taskDraftDescriptionRaw.current = newTask.description;

                          setTimeout(() => {
                            if (taskContainerRef.current) {
                              taskContainerRef.current.scrollTo({
                                top: taskContainerRef.current.scrollHeight,
                                behavior: "smooth",
                              });
                            }
                          }, 100);
                        } catch (error) {
                          console.error("Error creating new task:", error);
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.transition = "transform 0.2s";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      + Add Task
                    </Button>
                  )}
                </Flex>
              )}
            </>
          )}
        </ScrollArea>
        {logs && logs.length > 0 && (
          <Slider
            showLabelOnHover={false}
            defaultValue={100}
            style={{
              width: "95%",
            }}
            styles={{
              thumb: {
                backgroundColor:
                  valueMapping.findIndex(
                    (item) => item.id === selectedLog?.id
                  ) ===
                  valueMapping.length - 1
                    ? "red"
                    : "",
                borderColor:
                  valueMapping.findIndex(
                    (item) => item.id === selectedLog?.id
                  ) ===
                  valueMapping.length - 1
                    ? "red"
                    : "",
              },
              label: {
                left:
                  valueMapping.findIndex(
                    (item) => item.id === selectedLog?.id
                  ) === 0
                    ? "0"
                    : "auto",
              },
            }}
            label={(value) => {
              if (!selectedLog) {
                return value;
              }

              if (
                valueMapping.findIndex((item) => item.id === selectedLog.id) ===
                valueMapping.length - 1
              ) {
                return "Current";
              }

              return selectedLog
                ? moment
                    .utc(selectedLog.created_date, "YYYY-MM-DD HH:mm:ss")
                    .tz("America/Los_Angeles")
                    .format("YYYY-MM-DD HH:mm:ss")
                : value;
            }}
            onChange={(value) => {
              let startIndex = 0;

              while (startIndex < valueMapping.length) {
                const item = valueMapping[startIndex];

                if (value < item.value) {
                  break;
                }

                startIndex += 1;
              }

              setSelectedLog(
                logs?.find(
                  (item) => item.id === valueMapping[startIndex - 1].id
                ) ?? null
              );
            }}
          />
        )}
      </Flex>
      {logs && logs.length > 0 && (
        <Tooltip
          width={500}
          label={
            !selectedLog ? (
              "No Memories"
            ) : (
              <Flex direction={"column"} align={"center"}>
                <Text>Last Event:</Text>
                <Text style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                  Title: {selectedLog.title}
                </Text>
                <Text style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                  {selectedLog.created_date}
                </Text>
                <Text style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                  {selectedLog.json_data?.memory}
                </Text>
              </Flex>
            )
          }
        >
          {valueMapping.findIndex((item) => item.id === selectedLog?.id) ===
          valueMapping.length - 1 ? (
            <Badge color="green" size={"lg"}>
              Live
            </Badge>
          ) : (
            <Badge color="red" size={"lg"}>
              Snapshot
            </Badge>
          )}
        </Tooltip>
      )}
    </Paper>
  );
};

const TaskRenderer = ({
  task,
  counter,
  segment,
  // messages,
  threads,
  currentSessionId,
  handleStrategySubmit,
  setOpenedTaskIndex,
}: {
  task: TaskType;
  counter: Number;
  // messages: MessageType[],
  threads: ThreadType[];
  currentSessionId: Number | null;
  segment?: TransformedSegment | undefined;
  handleStrategySubmit: () => void;
  setOpenedTaskIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const sequencesV2Ref = useRef(null);
  const [lastLoadedProjectId, setLastLoadedProjectId] = useState<number>(-1);
  const [sequences, setSequences] = useState<any[]>([]);
  const [linkedinInitialMessages, setLinkedinInitialMessages] = useState<any[]>(
    []
  );

  const [emailSubjectLines, setEmailSubjectLines] = useRecoilState<
    SubjectLineTemplate[]
  >(emailSubjectLinesState);

  const [personalizers, setPersonalizers] = useState([]);
  const userToken = useRecoilValue(userTokenState);
  const emailSequenceData = useRecoilValue(emailSequenceState);

  const currentThread = threads.find(
    (thread) => thread.id === currentSessionId
  );

  const updateConnectionType = (
    newConnectionType: string,
    campaignId: number
  ) => {
    fetch(
      `${API_URL}/client/archetype/${campaignId}/update_email_to_linkedin_connection`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          email_to_linkedin_connection: newConnectionType,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Connection type updated");
        }
        showNotification({
          title: "Connection Type Updated",
          message: "Connection type has been updated.",
        });
      })
      .catch((error) => {
        console.error("Error updating connection type", error);
      })
      .finally(() => {
        setCurrentProject((prevProject) => {
          if (!prevProject) return null;
          return {
            ...prevProject,
            email_to_linkedin_connection: newConnectionType,
          };
        });
        // if (currentProject && currentProject.testing_volume) {
        //   setTestingVolume(currentProject.testing_volume);
        // }
      });
  };

  useEffect(() => {
    if (currentProject?.id && currentProject?.id !== lastLoadedProjectId) {
      setLastLoadedProjectId(currentProject?.id);
      (async (campaignId: any) => {
        const project = await getFreshCurrentProject(userToken, campaignId);
        setCurrentProject(project);
        saveCurrentPersonaId(currentProject?.id.toString());
      })(currentProject?.id);
    }
  }, [currentProject]);

  switch (task.widget_type) {
    case "LAUNCH_CAMPAIGN":
      return (
        <CampaignLandingV2
          showOnlyHeader
          showLaunchButton
          forcedCampaignId={currentThread?.memory.campaign_id}
        />
      );
    case "VIEW_PERSONALIZERS":
      return (
        <Personalizers
          forcedCampaignId={currentThread?.memory.campaign_id}
          ai_researcher_id={currentProject?.ai_researcher_id}
          sequences={emailSequenceData}
          setPersonalizers={setPersonalizers}
          personalizers={personalizers}
        />
      );
    case "VIEW_STRATEGY":
      return (
        <SelinStrategy
          counter={counter}
          // messages={messages}
          threads={threads}
          currentSessionId={currentSessionId}
          handleSubmit={handleStrategySubmit}
          setOpenedTaskIndex={setOpenedTaskIndex}
        />
      );
    case "REVIEW_PROSPECTS":
      return <ArchetypeFilters hideFeature={true} />;
    case "ONE_SHOT_GENERATOR":
      return (
        <UploadProspectsModal
          context={{
            modals: [],
            openModal: () => "",
            openConfirmModal: () => "",
            openContextModal: () => "",
            closeModal: () => "",
            closeContextModal: () => "",
            closeAll: () => "",
          }}
          id={""}
          innerProps={{
            mode: "CREATE-ONLY",
            strategy_id: currentThread?.memory?.strategy_id,
            selixSessionId: currentSessionId,
          }}
        />
      );
    case "COMPANY_SEGMENT":
      return (
        <CompanySegmentReview
          selixSessionId={currentSessionId}
          connectedCompanySegmentId={currentThread?.memory?.company_segment_id}
        />
      );
    case "REVIEW_COMPANIES":
      if (!segment) {
        return (
          <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Loader />
          </Flex>
        );
      } else {
        return (
          <ContactAccountFilterModal
            key={currentProject?.id}
            segment={segment}
            showContactAccountFilterModal={true}
            setShowContactAccountFilterModal={() => {}}
            isModal={false}
          />
        );
      }
    case "VIEW_SEQUENCE":
      return (
        <SequencesV2
          ref={sequencesV2Ref}
          showComponent={true}
          updateConnectionType={updateConnectionType}
          forcedCampaignId={currentProject?.id}
        />
      );
    default:
      return (
        <>
          {task.proof_of_work_img && (
            <img
              src={task.proof_of_work_img}
              alt="Proof of Work"
              width={"100%"}
              height={"100%"}
              style={{ marginTop: "10px" }}
            />
          )}
        </>
      );
  }
};

const FilesComponent = ({
  currentSessionId,
  attachedFile,
}: {
  currentSessionId: Number | null;
  attachedFile: File | null;
}) => {
  const [files, setFiles] = useState<
    { name: string; description: string; uploadDate: string; base64: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const userToken = useRecoilValue(userTokenState);
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const handleDescriptionChange = (index: number, value: string) => {
    const newFiles = [...files];
    newFiles[index].description = value;
    setFiles(newFiles);
  };
  const saveDescription = async (index: number) => {
    if (files[index].description.trim() === "") {
      console.error("Description cannot be empty");
      return;
    }
    const file = files[index];
    try {
      const response = fetch(`${API_URL}/selix/update_file_description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          file_name: file.name,
          description: file.description,
        }),
      });

      if (!response) {
        console.error("Failed to update file description");
      }
    } catch (error) {
      console.error("Error updating file description:", error);
    } finally {
      setEditingTextIndex(null);
    }
  };

  const fetchFiles = async () => {
    if (currentSessionId) {
      try {
        const response = await fetch(`${API_URL}/selix/get_files_in_session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ session_id: currentSessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          const formattedFiles = data.map((file: any) => ({
            name: file.file_name,
            description: file.description,
            uploadDate: new Date(file.created_at).toLocaleDateString(),
            base64: file.file, // file.file is the base64 of the file
          }));
          setFiles(formattedFiles);
        } else {
          console.error("Failed to fetch files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentSessionId]);

  useEffect(() => {
    if (attachedFile === null) {
      const timer = setTimeout(() => {
        fetchFiles();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [attachedFile]);

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Loader />
      </Flex>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Description</th>
          <th>Upload Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => setEditingTextIndex(index)}
          >
            <td style={{ position: "relative" }}>{file.name}</td>
            <td style={{ position: "relative" }}>
              {editingTextIndex === index ? (
                <Textarea
                  w={"100%"}
                  value={file.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  onBlur={() => saveDescription(index)}
                  autoFocus
                />
              ) : (
                <Text>
                  {file.description.length > 70 ? (
                    <HoverCard width={300} shadow="md">
                      <HoverCard.Target>
                        <Text>{file.description.substring(0, 70) + "..."}</Text>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text
                          size="sm"
                          style={{
                            wordWrap: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {file.description}
                        </Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  ) : (
                    file.description
                  )}
                  <IconPencil
                    size="0.8rem"
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "5px",
                      color: "#888",
                    }}
                  />
                </Text>
              )}
            </td>
            <td>{file.uploadDate}</td>
            <td>
              <Button
                component="a"
                href={`data:application/octet-stream;base64,${file.base64}`}
                download={file.name}
                variant="outline"
                color="blue"
              >
                Download
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const SelinStrategy = ({
  messages,
  counter,
  setPrompt,
  handleSubmit,
  threads,
  currentSessionId,
  setOpenedTaskIndex,
}: {
  messages?: any[];
  setPrompt?: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit?: (file: any, message: string) => void;
  threads: ThreadType[];
  currentSessionId: Number | null;
  counter: Number;
  setOpenedTaskIndex?: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const memory = threads.find(
    (thread) => thread.id === currentSessionId
  )?.memory;

  const hackedSubmit = () => {
    handleSubmit &&
      handleSubmit(
        undefined,
        "Let's do it - create the task list and start executing."
      );
  };

  // console.log('memory is', memory);
  const userToken = useRecoilValue(userTokenState);

  const { getStrategy, patchUpdateStrategy } = useStrategiesApi(userToken);

  const [strategy, setStrategy] = useState<
    | {
        client_archetype_mappings: any[];
        client_id: number;
        created_by: number;
        description: string;
        end_date: string;
        id: number;
        start_date: string;
        status: string;
        tagged_campaigns: any | null;
        title: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (memory?.strategy_id) {
      getStrategy(memory.strategy_id)
        .then((res) => {
          console.log(res);
          setStrategy(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [...threads]);

  return (
    <Paper withBorder radius={"sm"}>
      <Flex bg={"#1E90FF"} p={"sm"}>
        <Text tt={"uppercase"} fw={600} color="white">
          Task Plan:{" "}
          <span className="text-gray-200">
            {strategy?.title.replace(/['"]/g, "")}
          </span>
        </Text>
      </Flex>
      <Stack p={"sm"}>
        {handleSubmit && (
          <Paper
            withBorder
            bg={"#F0FFF0"}
            px={"sm"}
            py={"xs"}
            style={{ borderColor: "#32CD32" }}
          >
            <Flex align={"center"} gap={"xs"}>
              <IconInfoCircle color="green" size={"1rem"} />
              <Text size={"sm"} color="#228B22" fw={600}>
                This Task Plan summarizes the angle for your campaign. Review
                then press 'Save Draft'
              </Text>
            </Flex>
          </Paper>
        )}
        <ScrollArea h={"34vh"} p={"sm"} my={"sm"}>
          <Flex>
            <Text color="gray" fw={500} w={160} size={"xs"}>
              Strategy Name:
            </Text>
            <Text fw={500} size={"xs"}>
              {strategy?.title.replace(/['"]/g, "")}
            </Text>
          </Flex>
          <Flex>
            <div className="w-[160px]">
              <Text color="gray" fw={500} w={160} size={"xs"}>
                Description:
              </Text>
            </div>
            <Stack spacing={"sm"}>
              <Box>
                <Text fw={600} size={"xs"}></Text>
                <Text fw={500} size={"xs"}>
                  <Text
                    fw={500}
                    size={"xs"}
                    dangerouslySetInnerHTML={{
                      __html: strategy?.description || "",
                    }}
                  />
                </Text>
              </Box>
              <Box>
                {/* <Text fw={600} size={"xs"}>
                Angle:
              </Text>
              <Text fw={500} size={"xs"}>
                {
                  "The main approach for this campaign is to leverage the MachineCon conference to establish initial contact with prospects and discuss potential collaboration opportunites. The focus will be on inviting them to our booth for a personal chat."
                }
              </Text> */}
                {/* <Box>
                <Text fw={600} size={"xs"}>
                  Prospects:
                </Text>
                <Text fw={500} size={"xs"}>
                  {"We will target professionals attending MachineCon, particularly those with titles such as,"}
                </Text>
              </Box> */}
              </Box>
            </Stack>
          </Flex>
          <Flex>
            <div className="w-[160px]">
              <Text size={"xs"} color="gray" fw={500} w={160}>
                Attached Campaigns:
              </Text>
            </div>
            {strategy?.tagged_campaigns &&
            strategy.tagged_campaigns.length > 0 ? (
              strategy.tagged_campaigns.map(
                (campaign: number, index: number) => (
                  <Badge key={index} color="green">
                    {campaign.toString()}
                  </Badge>
                )
              )
            ) : (
              <Badge color="gray">None</Badge>
            )}
          </Flex>
          <Flex>
            <div className="w-[160px]">
              <Text color="gray" fw={500} w={160} size={"xs"}>
                Time Frame:
              </Text>
            </div>
            <Text size={"xs"} color="blue" fw={600}>
              {strategy?.start_date
                ? moment(strategy.start_date).format("MMMM Do, YYYY")
                : "N/A"}{" "}
              -{" "}
              {strategy?.end_date
                ? moment(strategy.end_date).format("MMMM Do, YYYY")
                : "N/A"}
            </Text>
          </Flex>
        </ScrollArea>
        {handleSubmit && (
          <Flex align={"center"} gap={"md"}>
            <Button
              variant="outline"
              color="gray"
              fullWidth
              onClick={() => {
                if (!memory?.strategy_id) {
                  return;
                }
                openContextModal({
                  modal: "editStrategy",
                  title: (
                    <Flex align={"center"} gap={"sm"}>
                      <IconBulb color="#228be6" size={"1.6rem"} />
                      <Title order={2}>Edit Strategy</Title>
                    </Flex>
                  ),
                  styles: {
                    content: {
                      minWidth: "70%",
                    },
                  },
                  innerProps: {
                    title: strategy?.title,
                    description: strategy?.description,
                    archetypes: [],
                    status: strategy?.status,
                    startDate: strategy?.start_date
                      ? new Date(strategy.start_date)
                      : null,
                    endDate: strategy?.end_date
                      ? new Date(strategy.end_date)
                      : null,
                    onSubmit: async (
                      title: string,
                      description: string,
                      archetypes: number[],
                      status: string,
                      startDate: Date,
                      endDate: Date
                    ) => {
                      const response = await patchUpdateStrategy(
                        memory?.strategy_id || -1,
                        title,
                        description,
                        archetypes,
                        status,
                        startDate,
                        endDate
                      );
                      //yolo
                      const updatedStrategy = await getStrategy(
                        memory?.strategy_id || -1
                      );
                      setStrategy(updatedStrategy);
                      showNotification({
                        title: "Success",
                        message: "Strategy updated successfully",
                        color: "green",
                      });
                    },
                  },
                });
              }}
            >
              Edit
            </Button>
            <Button
              fullWidth
              onClick={() => {
                showNotification({
                  title: "Task Creation",
                  message: "Drafting Campaign: " + strategy?.title,
                  color: "green",
                  icon: <IconCheck />,
                });

                if (!memory?.strategy_id) {
                  return;
                }
                hackedSubmit();
                if (setOpenedTaskIndex) {
                  setOpenedTaskIndex(null);
                }
              }}
            >
              Save Draft
            </Button>
          </Flex>
        )}
      </Stack>
    </Paper>
  );
};
