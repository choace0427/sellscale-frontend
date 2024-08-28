import {
  emailSequenceState,
  emailSubjectLinesState,
  userDataState,
  userTokenState,
} from "@atoms/userAtoms";
import posthog from "posthog-js";
import { TransformedSegment } from "@pages/SegmentV3/SegmentV3";

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
} from "@mantine/core";
import {
  IconBrowser,
  IconBulb,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconClock,
  IconEar,
  IconEye,
  IconEyeOff,
  IconFile,
  IconFlask,
  IconHammer,
  IconHistory,
  IconInfoCircle,
  IconLink,
  IconList,
  IconParachute,
  IconPlus,
  IconPoint,
  IconPuzzle,
  IconSend,
  IconTrash,
  IconTriangleInverted,
} from "@tabler/icons";
import { IconSparkles, IconUserShare } from "@tabler/icons-react";
import moment from "moment";
import {
  Dispatch,
  Fragment,
  Key,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import React, { forwardRef, useImperativeHandle } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { proxyURL } from "@utils/general";

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
  handleSubmit: (file: {
    name: string;
    base64: string;
    description: string;
  }) => void;
}

import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { Modal, Overlay } from "@mantine/core";
import { currentProjectState } from "@atoms/personaAtoms";
import { getFreshCurrentProject, isFreeUser } from "@auth/core";
import Tour from "reactour";
import { useNavigate } from "react-router-dom";
import Sequences from "@pages/CampaignV2/Sequences";
import { SubjectLineTemplate } from "src";
import { ArchetypeFilters } from "@pages/CampaignV2/ArchetypeFilterModal";
import SellScaleAssistant from "./SellScaleAssistant";
import Personalizers from "@pages/CampaignV2/Personalizers";
import ContactAccountFilterModal from "@modals/ContactAccountFilterModal";

const DropzoneWrapper = forwardRef<unknown, CustomCursorWrapperProps>(
  ({ children, handleSubmit }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState("");

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        setFile(files[0]);
        setIsModalOpen(true);
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
      setFile(null);
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
        setIsModalOpen(true);
      },
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
  tab: "STRATEGY_CREATOR" | "PLANNER" | "BROWSER" | "ICP";
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
}

interface MessageType {
  created_time: string;
  message: string;
  role: "user" | "assistant" | "system";
  type: "message" | "strategy" | "planner" | "analytics" | "action";
  action_description?: string;
  action_title?: string;
  action_function?: string;
  action_params?: {
    title: string;
    description: string;
  };
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
  const [prompt, setPrompt] = useState("");
  const promptRef = useRef<string>("");
  const promptLengthRef = useRef<number>(0);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionHidden, setSuggestionHidden] = useState(true);
  const [suggestedFirstMessage, setSuggestedFirstMessage] = useState<string[]>(
    []
  );
  const [recording, setRecording] = useState(false);
  const prevPromptLengthRef = useRef<number>(0);
  const prevSlideUpTime = useRef<number>(0);
  const dropzoneRef = useRef<{ handleDrop: (file: File) => void } | null>(null);

  const freeUser = isFreeUser();

  const navigate = useNavigate();

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
    forcePrompt?: string
  ) => {
    let messagToSend = forcePrompt || prompt;

    //custom handle submit function to handle file uploads
    if (file) {
      const response = await fetch(`${API_URL}/selix/upload_file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          // device_id: deviceIDRef.current,
          session_id: sessionIDRef.current,
          file: file.base64,
          file_name: file.name,
          description: file.description,
        }),
      });

      if (response.status === 400) {
        showNotification({
          title: "File upload failed",
          message: "Please try uploading a file less than 5mb in size!",
          color: "red",
          icon: <IconCircleCheck />,
        });
      }

      if (response.status === 429) {
        showNotification({
          title: "File upload failed",
          message:
            "You have reached the maximum file upload count! Please reach out to csm@sellscale.com",
          color: "red",
          icon: <IconCircleCheck />,
        });
      }

      return;
    }

    if (messagToSend.trim() !== "") {
      const newChatPrompt: MessageType = {
        created_time: moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
        message: messagToSend,
        role: "user",
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

      const loadingMessage: MessageType = {
        created_time: moment().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
        message: "loading",
        role: "assistant",
        type: "message",
      };

      setMessages((chatContent: MessageType[]) => [
        ...chatContent,
        loadingMessage,
      ]);

      try {
        const response = await fetch(`${API_URL}/selix/create_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            device_id: deviceIDRef.current,
            session_id: currentSessionId,
            message: messagToSend,
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
        body: JSON.stringify({ additional_context: "", room_id: room_id }), // Placeholder for the body
      });
      const data = await response;
      console.log("data is", data);
    } catch (error) {
      console.error("Error creating new session:", error);
    } finally {
      setLoadingNewChat(false);
    }
  };

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
    // console.log("comparing device id", data.device_id, deviceIDRef.current);
    if (data?.device_id === deviceIDRef.current) {
      return;
    }
    if (data.thread_id === roomIDref.current) {
      if (data.message) {
        setMessages((chatContent: MessageType[]) => [
          ...chatContent,
          {
            created_time: moment().format("MMMM D, h:mm a"),
            message: data?.message || "",
            role: data?.role || "assistant",
            type: "message",
          },
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
      if (data.tab === "ICP") {
        setAIType("");
        setTimeout(() => setAIType("ICP"), 0);
      } else {
        setAIType(data.tab);
      }
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
          if (task.selix_session_id === sessionIDRef.current) {
            const updatedTasks = Array.isArray(thread.tasks)
              ? [...thread.tasks, task]
              : [task];
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

  const handleUpdateTaskAndAction = (
    data: {
      task: TaskType;
      action?: MessageType;
      thread_id: string;
    },
    setMessages: any
  ) => {
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
      showNotification({
        title: "Session updated",
        message: `Session: ${data.session.session_name} has been updated`,
        color: "green",
        icon: <IconCircleCheck />,
      });

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
        const memory = threads.find((thread) => thread.id === currentSessionId)
          ?.memory;
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
      const threadIdFromUrl = urlParams.get("thread_id");
      console.log("session id from url is", sessionIdFromUrl);
      console.log("got here");
      if (sessionIdFromUrl) {
        // Clear the URL parameters from the input bar
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        getMessages(
          threadIdFromUrl || "",
          parseInt(sessionIdFromUrl),
          threads_loaded,
          "PLANNER"
        );
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

  return (
    <DropzoneWrapper ref={dropzoneRef} handleSubmit={handleSubmit}>
      <Card p="lg" maw={"100%"} ml="auto" mr="auto" mt="sm">
        <div>
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100px",
              top: "-50px",
              zIndex: 2,
            }}
          ></div>

          <Card withBorder radius={"sm"}>
            <Flex align={"center"} justify={"space-between"}>
              <Flex
                align={"center"}
                w={"100%"}
                justify={"flex-start"}
                className="hover:cursor-pointer"
                onClick={() => setOpened(!openedChat)}
              >
                {/* <ThemeIcon
                radius="xl"
                size="xs"
                color={threads.filter((thread) => thread.status === "ACTIVE").length > 0 ? "green" : "gray"}
                variant={threads.filter((thread) => thread.status === "ACTIVE").length > 0 ? "filled" : "light"}
                className={threads.filter((thread) => thread.status === "ACTIVE").length > 0 ? "pulsing-bubble" : ""}
              >
                <span />
              </ThemeIcon> */}
                <div className="flex items-center justify-center bg-green-100 rounded-full p-1 border-green-300 border-[1px] border-solid">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <Text fw={600} color="black" className="text-left" ml="xs">
                  {
                    threads.filter(
                      (item: ThreadType) => item.id === sessionIDRef.current
                    )[0]?.session_name
                  }
                </Text>
                <Text color="gray" fw={500} ml={"sm"}>
                  {Math.max(
                    0,
                    threads.filter(
                      (thread) =>
                        thread.status !== "COMPLETE" &&
                        thread.status !== "CANCELLED"
                    ).length - 1
                  )}{" "}
                  {Math.max(
                    0,
                    threads.filter(
                      (thread) =>
                        thread.status !== "COMPLETE" &&
                        thread.status !== "CANCELLED"
                    ).length - 1
                  ) > 1
                    ? "other active sessions"
                    : "other active session"}
                </Text>
              </Flex>
              <Flex align={"center"} gap={"sm"}>
                {openedChat && (
                  <SegmentedControl
                    onChange={setType}
                    data={[
                      {
                        value: "active",
                        label: (
                          <Center>
                            <Box>Active</Box>

                            <Badge
                              ml={5}
                              color={type === "active" ? "blue" : "gray"}
                            >
                              {
                                threads.filter(
                                  (thread) =>
                                    thread.status === "ACTIVE" ||
                                    thread.status === "PENDING_OPERATOR" ||
                                    thread.status === "BLOCKED"
                                ).length
                              }
                            </Badge>
                          </Center>
                        ),
                      },
                      {
                        value: "past",
                        label: (
                          <Center>
                            <Box>Past Sessions</Box>

                            <Badge
                              ml={5}
                              color={type === "past" ? "blue" : "gray"}
                            >
                              {
                                threads.filter(
                                  (thread) =>
                                    thread.status === "COMPLETE" ||
                                    thread.status === "CANCELLED"
                                ).length
                              }
                            </Badge>
                          </Center>
                        ),
                      },
                    ]}
                  />
                )}
                <ActionIcon
                  variant="transparent"
                  onClick={() => setOpened(!openedChat)}
                >
                  {openedChat ? (
                    <IconChevronDown size={"1rem"} color="black" />
                  ) : (
                    <IconChevronUp size={"1rem"} color="black" />
                  )}
                </ActionIcon>
              </Flex>
            </Flex>
            <Collapse in={openedChat}>
              <Flex mt={"md"} gap={"sm"}>
                <Button
                  leftIcon={
                    <IconPlus
                      color={newButtonHover ? "white" : "#D444F1"}
                      size={"1.3rem"}
                    />
                  }
                  className="bg-[#D444F1]/10 hover:bg-[#D444F1]/80 text-[#D444F1] hover:text-white"
                  onClick={
                    !loadingNewChat ? () => handleCreateNewSession() : undefined
                  }
                  loading={loadingNewChat}
                  px={30}
                  h={72}
                  onMouseEnter={() => setNewButtonHover(true)}
                  onMouseLeave={() => setNewButtonHover(false)}
                >
                  New Chat
                </Button>
                <div
                  ref={containerRef}
                  style={{ overflowX: "hidden", whiteSpace: "nowrap" }}
                >
                  {threads
                    .sort((a, b) => b.id - a.id)
                    .filter((thread) =>
                      type === "active"
                        ? thread.status === "ACTIVE" ||
                          thread.status === "PENDING_OPERATOR" ||
                          thread.status === "BLOCKED"
                        : thread.status === "COMPLETE" ||
                          thread.status === "CANCELLED"
                    )
                    .map((thread: ThreadType, index) => {
                      return (
                        <Paper
                          key={index}
                          withBorder
                          mr="sm"
                          radius={"sm"}
                          p={"sm"}
                          style={{
                            display: "inline-block",
                            minWidth: "350px",
                            backgroundColor:
                              sessionIDRef.current === thread.id
                                ? "#d0f0c0"
                                : "white", // Highlight if current thread
                            borderColor:
                              sessionIDRef.current === thread.id
                                ? "#00796b"
                                : "#ced4da", // Change border color if current thread
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
                          {/* <Flex align={"center"} gap={"sm"}>
                            {thread.status === "ACTIVE" ? (
                              <div className="flex items-center justify-center bg-green-100 rounded-full p-1 border-green-300 border-[1px] border-solid">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            ) : // </ThemeIcon>
                            thread.status === "COMPLETE" ? (
                              <IconCircleCheck size={"1rem"} fill="green" color="white" />
                            ) : thread.status === "PENDING_OPERATOR" ? (
                              // <ThemeIcon color="orange" radius={"xl"} size={"xs"} p={0} variant="light">
                              //   <IconPoint fill="orange" color="white" size={"4rem"} />
                              // </ThemeIcon>
                              <div className="flex items-center justify-center bg-orange-100 rounded-full p-1 border-orange-300 border-[1px] border-solid">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              </div>
                            ) : (
                              <></>
                            )}{" "}
                            <Text color={thread.status === "PENDING_OPERATOR" ? "orange" : "green"} fw={600}>
                              {thread.status === "PENDING_OPERATOR" ? "IN PROGRESS" : thread.status}
                            </Text>
                            <ActionIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setThreads((prevThreads) => prevThreads.filter((prevThread) => prevThread.id !== thread.id));
                                //if the chat we're in is the one we're deleting, we need to get the next chat
                                if (sessionIDRef.current === thread.id) {
                                  const nextThread = threads.find((thread) => thread.id !== sessionIDRef.current);
                                  if (nextThread) {
                                    getMessages(nextThread.thread_id, nextThread.id);
                                  } else {
                                    handleCreateNewSession();
                                    setAIType("PLANNER");
                                  }
                                }

                                //query to delete thread
                                fetch(`${API_URL}/selix/delete_session`, {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${userToken}`,
                                  },
                                  body: JSON.stringify({
                                    session_id: thread.id,
                                  }),
                                });
                              }}
                              style={{ marginLeft: "auto" }}
                            >
                              <IconTrash size={"1rem"} color="red" />
                            </ActionIcon>
                          </Flex> */}
                          <Flex align={"center"} justify={"space-between"}>
                            <Text fw={600}>
                              {thread.session_name || "Untitled Session"}
                            </Text>
                            {hoverChat && hoverChat === thread.id && (
                              <ActionIcon
                                variant="transparent"
                                color="red"
                                size={"sm"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThreads((prevThreads) => prevThreads.filter((prevThread) => prevThread.id !== thread.id));
                                  fetch(`${API_URL}/selix/delete_session`, {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${userToken}`,
                                    },
                                    body: JSON.stringify({
                                      session_id: thread.id,
                                    }),
                                  })
                                    .then((response) => {
                                      if (!response.ok) {
                                        return response.json().then((data) => {
                                          throw new Error(data.error || "Failed to delete session");
                                        });
                                      }
                                      return response.json();
                                    })
                                    .then((data) => {
                                      console.log("Session deleted:", data.message);
                                    })
                                    .catch((error) => {
                                      console.error("Error deleting session:", error);
                                    });
                                  }}
                              >
                                <IconTrash size={"1rem"} />
                              </ActionIcon>
                            )}
                          </Flex>
                          <Flex align={"center"} gap={"xs"}>
                            {thread.status === "ACTIVE" && (
                              <Flex align={"center"} gap={4}>
                                <div className="flex items-center justify-center bg-green-100 rounded-full p-1 border-green-300 border-[1px] border-solid">
                                  <div className="w-[6px] h-[6px] bg-green-500 rounded-full"></div>
                                </div>
                                <Text color="green" fw={500} size={"sm"}>
                                  Live
                                </Text>
                              </Flex>
                            )}
                            {thread.status === "PENDING_OPERATOR" && (
                              <Flex align={"center"} gap={4}>
                                <div className="flex items-center justify-center bg-yellow-100 rounded-full p-1 border-yellow-300 border-[1px] border-solid">
                                  <div className="w-[6px] h-[6px] bg-yellow-500 rounded-full"></div>
                                </div>
                                <Text color="yellow" fw={500} size={"sm"}>
                                  In Progress
                                </Text>
                              </Flex>
                            )}
                            {thread.status === "BLOCKED" && (
                              <Flex align={"center"} gap={4}>
                                <div className="flex items-center justify-center bg-red-100 rounded-full p-1 border-red-300 border-[1px] border-solid">
                                  <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
                                </div>
                                <Text color="red" fw={500} size={"sm"}>
                                  Blocked
                                </Text>
                              </Flex>
                            )}
                            {thread.status === "COMPLETE" && (
                              <Flex align={"center"} gap={4}>
                                <div className="flex items-center justify-center bg-blue-100 rounded-full p-1 border-blue-300 border-[1px] border-solid">
                                  <div className="w-[6px] h-[6px] bg-blue-500 rounded-full"></div>
                                </div>
                                <Text color="blue" fw={500} size={"sm"}>
                                  Done
                                </Text>
                              </Flex>
                            )}
                            {thread.status === "CANCELLED" && (
                              <Flex align={"center"} gap={4}>
                                <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 border-gray-300 border-[1px] border-solid">
                                  <div className="w-[6px] h-[6px] bg-gray-500 rounded-full"></div>
                                </div>
                                <Text color="gray" fw={500} size={"sm"}>
                                  Cancelled
                                </Text>
                              </Flex>
                            )}

                            <Text color="gray" size={"sm"}>
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
                    })}
                </div>
              </Flex>
            </Collapse>
          </Card>
        </div>
        {currentSessionId && (
          <Flex mt={"md"} gap={"xl"}>
            <LoadingOverlay visible={loadingNewChat} />
            <SegmentChat
              dropzoneRef={dropzoneRef}
              suggestedFirstMessage={suggestedFirstMessage}
              setSuggestionHidden={setSuggestionHidden}
              suggestionHidden={suggestionHidden}
              suggestion={suggestion}
              handleSubmit={handleSubmit}
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
              // generateResponse={generateResponse}
              // chatContent={chatContent}
              // setChatContent={setChatContent}
            />
            <SelixControlCenter
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
          </Flex>
        )}
      </Card>
    </DropzoneWrapper>
  );
}

const SegmentChat = (props: any) => {
  const suggestedFirstMessage: string[] = props.suggestedFirstMessage;
  const handleSubmit = props.handleSubmit;
  const dropzoneRef = props.dropzoneRef;
  const prompt = props.prompt;
  const aiType = props.aiType;
  const promptRef = props.promptRef;
  const suggestion = props.suggestion;
  const suggestionHidden = props.suggestionHidden;
  const setSuggestionHidden = props.setSuggestionHidden;
  const recording = props.recording;
  const setRecording = props.setRecording;
  const setPrompt = props.setPrompt;
  const messages: MessageType[] = props.messages;
  const userData = useRecoilValue(userDataState);
  const userToken = useRecoilValue(userTokenState);
  const [showLoader, setShowLoader] = useState(false);
  // const [recording, setRecording] = useState(false);

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
    if (aiType === 'PLANNER' && viewport.current) {
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
      handleSubmit();
    }
  };

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [uncollapsedCards, setUncollapsedCards] = useState<{
    [key: number]: boolean;
  }>({});

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
    handleSubmit();
    setRecording(false);
  }, [shouldSubmit]);

  return (
    <Paper withBorder shadow="sm" radius={"md"} w={"35%"} h={"100%"}>
      <Flex
        px={"md"}
        py={"xs"}
        align={"center"}
        gap={5}
        bg={"white"}
        className=" rounded-t-md"
      >
        <IconSparkles size={"1rem"} color="#E25DEE" fill="#E25DEE" />
        <Text fw={600}>Chat with Selix</Text>
      </Flex>
      <Divider bg="gray" />
      <ScrollArea
        h={"53vh"}
        viewportRef={viewport}
        scrollHideDelay={4000}
        style={{ overflow: "hidden" }}
      >
        {messages.length > 1 ? (
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
                      maw={"85%"}
                      gap={4}
                      key={index}
                      ml={message.role === "user" ? "auto" : "0"}
                      style={{
                        backgroundColor:
                          message.role === "user" ? "#f7ffff" : "#fafafa",
                        borderRadius: "10px",
                        border: "1px solid #e7ebef",
                        padding: "10px",
                      }}
                    >
                      <Flex gap={4} align={"center"}>
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
                          color="gray"
                          size="xs"
                          ml={message.role === "user" ? "auto" : "0"}
                        >
                          {moment(message.created_time).format(
                            "MMMM D, h:mm A"
                          )}
                        </Text>
                      </Text>
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
                          {!messages[index + 1] && (
                            <Loader size="sm" color="white" />
                          )}

                          <Text fw={600} size="xs">
                            ✨ Executing: {message.action_title}
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
                        <Flex
                          data-tour="selix-tour"
                          direction="column"
                          align="center"
                          justify="center"
                          bg="#f0f4ff"
                          w="200%"
                          p="md"
                          mb="md"
                          style={{
                            border: "1px solid #d0d7ff",
                            borderRadius: "8px",
                          }}
                        >
                          <Text fw={600} size="md" color="#1e3a8a">
                            Speak into the microphone 🎙
                          </Text>
                          <Text fw={600} size="md" color="gray">
                            Typing is less effective.
                          </Text>
                        </Flex>
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
            <div className="absolute bottom-0 right-0 flex flex-col w-4/5 gap-1 pr-4">
              {suggestedFirstMessage.map((message, index) => (
                <Paper
                  key={index}
                  withBorder
                  p={"xs"}
                  radius={"md"}
                  className="hover:border-[#49494] cursor-pointer"
                >
                  <Flex
                    align={"center"}
                    gap={"xs"}
                    onClick={() => handleListClick(message)}
                  >
                    <ThemeIcon color="grape" size={"xl"} variant="light">
                      <IconUserShare size={"1.4rem"} />
                    </ThemeIcon>
                    <Text color="#E25DEE" fw={500} size={"sm"}>
                      {message}
                    </Text>
                  </Flex>
                </Paper>
              ))}
              {/* <Paper className="hover:border-[#49494] cursor-pointer" withBorder p={"xs"} radius={"md"} >
                <Flex
                  align={"center"}
                  gap={"xs"}
                  onClick={() =>
                    handleListClick(
                      "I want to set up pre-meetings for a conference in Vegas"
                    )
                  }
                >
                  <ThemeIcon color="grape" size={"xl"} variant="light">
                    <IconUserShare size={"1.4rem"} />
                  </ThemeIcon>
                  <Text color="#E25DEE" fw={500} size={"sm"}>
                    I need assistance organizing pre-meetings for an upcoming
                    conference
                  </Text>
                </Flex>
              </Paper>
              <Paper className="hover:border-[#49494] cursor-pointer" withBorder p={"xs"} radius={"md"}>
                <Flex
                  align={"center"}
                  gap={"xs"}
                  onClick={() =>
                    handleListClick(
                      "I have a campaign idea I've wanted to implement"
                    )
                  }
                >
                  <ThemeIcon color="grape" size={"xl"} variant="light">
                    <IconUserShare size={"1.4rem"} />
                  </ThemeIcon>
                  <Text color="#E25DEE" fw={500} size={"sm"}>
                    I have a campaign idea to implement
                  </Text>
                </Flex>
              </Paper> */}
            </div>
          </>
        )}
      </ScrollArea>
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "80%",
            position: "absolute",
            top: suggestion !== "" ? "-75px" : "0",
            left: "50%",
            transform: "translateX(-50%)",
            overflow: "hidden",
            height: suggestion !== "" ? "auto" : "0",
            visibility: suggestion !== "" ? "visible" : "hidden",
            zIndex: 1,
          }}
        >
          {
            <div
              id="slidingDiv"
              style={{
                backgroundColor: suggestionHidden ? "transparent" : "#E25DEE",
                padding: "13px",
                borderRadius: "8px",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "0.9rem",
                animation: suggestion !== "" ? "slideUp 0.5s forwards" : "none",
              }}
            >
              {"💡 " + suggestion}
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => slideDown()}
              >
                X
              </span>
            </div>
          }
        </div>
        <Paper
          p={"sm"}
          withBorder
          radius={"md"}
          className="bg-[#f7f8fa]"
          my={"lg"}
          mx={"md"}
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
            value={prompt}
            placeholder="Chat with AI..."
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setPrompt(e.target.value);
              const textarea = e.target;
              textarea.scrollTop = textarea.scrollHeight;
            }}
            variant="unstyled"
            inputContainer={(children) => (
              <div style={{ minHeight: "0px", cursor: "default" }}>
                {children}
              </div>
            )}
            maxRows={10}
            style={{
              minHeight: "80px",
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
              {/* <ActionIcon variant="outline" color="gray" radius={"xl"} size={"sm"}>
                <IconPlus size={"1rem"} />
              </ActionIcon> */}
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
                  handleSubmit();
                  setRecording(false);
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
      </div>
    </Paper>
  );
};

const SelixControlCenter = ({
  setAIType,
  aiType,
  tasks,
  recording,
  counter,
  messages,
  setMessages,
  setPrompt,
  handleSubmit,
  threads,
  currentSessionId,
}: {
  setAIType: React.Dispatch<React.SetStateAction<string>>;
  aiType: string;
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
    [1, 1, 1]?.map(() => false)
  );

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
    <Paper withBorder shadow="sm" w={"65%"} radius={"md"}>
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
        <SellScaleAssistant refresh={refreshIcp}/>
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
                        <span>Blueprint</span>
                      </Center>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                    <Text size="sm">
                      This section allows you to manage your project's
                      blueprint.
                    </Text>
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
                  onClick={() => setShowICPModal(true)}
                >
                  <Center style={{ gap: 10 }}>
                    <IconFlask size={"1rem"} />
                    <span>ICP</span>
                  </Center>
                </div>
              ),
            },
          ]}
        />
      </Paper>
      <ScrollArea bg={"#f7f8fa"} h={"90%"} scrollHideDelay={4000} p={"md"}>
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
            counter={counter}
            messagesLength={messages.length}
            threads={threads}
            tasks={tasks}
            currentSessionId={currentSessionId}
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
          //       Would you like to confirm the task lis tbefore getting started with Blueprint?
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
      {/* <Paper withBorder bg={"#fffcf5"} radius={"sm"} p={"sm"} style={{ borderColor: "#fab005" }} m="xs">
        <Flex align={"center"} justify={"space-between"}>
          <Text color="yellow" size={"sm"} fw={600} tt={"uppercase"} className="flex gap-2 items-center">
            <IconClock size={"1rem"} />
            estimated completion time:
          </Text>
          <Text size={"sm"} color="yellow" fw={600}>
            10 hrs, 28 min
          </Text>
        </Flex>
      </Paper>
      <TimelineComponent /> */}
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

const PlannerComponent = ({
  threads,
  counter,
  currentSessionId,
  messagesLength,
  tasks,
}: {
  threads: ThreadType[];
  currentSessionId: Number | null;
  messagesLength: number;
  tasks: TaskType[];
  counter: Number;
}) => {
  const [opened, { toggle }] = useDisclosure(true);
  const taskContainerRef = useRef<HTMLDivElement>(null);
  const [openedTaskIndex, setOpenedTaskIndex] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useRecoilState(
    currentProjectState
  );
  const userToken = useRecoilValue(userTokenState);
  const [showRewindImage, setShowRewindImage] = useState(false);
  const [selectedRewindImage, setSelectedRewindImage] = useState<string>("");
  const [segment, setSegment] = useState<TransformedSegment | undefined>(undefined);

  const campaignId = threads.find((thread) => thread.id === currentSessionId)
    ?.memory?.campaign_id;

  console.log('current thread is', threads.find((thread) => thread.id === currentSessionId));
  useEffect(() => {
    (async () => {
      if (campaignId) {
        console.log('getting fresh project');
        const [project, res] = await Promise.all([
          getFreshCurrentProject(userToken, campaignId),
          getSegments()
        ]);

        setSegment(res[0] || undefined);
        setCurrentProject(project);
        //show the 'launch campaign' task if a campaign is attached
        setOpenedTaskIndex(tasks.length - 1);
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
    tagFilter: boolean = false
  ) => {
    const url = new URL(`${API_URL}/segment/all`);
    if (includeAllInClient) {
      if (currentProject?.id !== undefined) {
        url.searchParams.append("archetype_id", currentProject.id.toString());
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

  return (
    <Paper p={"sm"} withBorder radius={"sm"}>
      <Flex w={"100%"} align={"center"} gap={"xs"}>
        {/* <Divider label="Next in line" labelPosition="left" w={"100%"} color="gray" fw={500} />
        <ActionIcon onClick={toggle}>{opened ? <IconChevronUp size={"1rem"} /> : <IconChevronDown size={"1rem"} />}</ActionIcon> */}
      </Flex>
      <Paper
        withBorder
        bg={"#fefafe"}
        my={"sm"}
        px={"sm"}
        py={8}
        style={{ borderColor: "#fadafc" }}
      >
        <Flex align={"center"} gap={"xs"} justify={"space-between"}>
          <Text size={"xs"} color="#E25DEE" fw={600}>
            Selix Tasks:{" "}
            <span className="font-medium text-gray-500">
              This is work that I'll execute. I'll ask you if anything comes up.
            </span>
          </Text>
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
      <Collapse in={opened}>
        <ScrollArea
          h={"55vh"}
          scrollHideDelay={4000}
          style={{ overflow: "hidden" }}
          viewportRef={taskContainerRef}
        >
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
                [SelixSessionTaskStatus.CANCELLED]: "red",
                [SelixSessionTaskStatus.BLOCKED]: "gray",
              };

              const humanReadableStatus = {
                [SelixSessionTaskStatus.QUEUED]: "Queued",
                [SelixSessionTaskStatus.IN_PROGRESS]: "In Progress",
                [SelixSessionTaskStatus.IN_PROGRESS_REVIEW_NEEDED]:
                  "In Progress",
                [SelixSessionTaskStatus.COMPLETE]: "Complete",
                [SelixSessionTaskStatus.CANCELLED]: "Cancelled",
                [SelixSessionTaskStatus.BLOCKED]: "Blocked",
              };

              return (
                <Paper withBorder p={"sm"} key={index} mb={"xs"} radius={"md"}>
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
                          Show Rewind
                        </Button>
                      </Tooltip>
                      <Text color="gray" size={"sm"} fw={500}>
                        {/* {moment(task.created_at).format("MM/DD/YY, h:mm a")} */}
                      </Text>
                      <Flex align={"center"} gap={"xs"} w={90}>
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
                    {currentProject && index === tasks.length - 1 ? (
                      <CampaignLandingV2
                        showOnlyHeader
                        showLaunchButton
                        forcedCampaignId={currentProject?.id}
                      />
                    ) : (
                      <TaskRenderer
                        // key={currentProject?.id}
                        task={task}
                        counter={counter}
                        segment={segment}
                        // messages={messages}
                        threads={threads}
                        currentSessionId={currentSessionId}
                      />
                    )}
                  </Collapse>
                </Paper>
              );
            })}
        </ScrollArea>
      </Collapse>
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
}: {
  task: TaskType;
  counter: Number;
  // messages: MessageType[],
  threads: ThreadType[];
  currentSessionId: Number | null;
  segment?: TransformedSegment | undefined;
}) => {
  const currentProject = useRecoilValue(currentProjectState);
  const [sequences, setSequences] = useState<any[]>([]);
  const [linkedinInitialMessages, setLinkedinInitialMessages] = useState<any[]>(
    []
  );

  const [emailSubjectLines, setEmailSubjectLines] = useRecoilState<
    SubjectLineTemplate[]
  >(emailSubjectLinesState);

  const [personalizers, setPersonalizers] = useState([]);
  const emailSequenceData = useRecoilValue(emailSequenceState);

  switch (task.widget_type) {
    case "LAUNCH_CAMPAIGN":
      return (
        <CampaignLandingV2
          showOnlyHeader
          showLaunchButton
          forcedCampaignId={currentProject?.id}
        />
      );
    case "VIEW_PERSONALIZERS":
    return (
      <Personalizers
        key={currentProject?.id} // Adding key to force re-render when currentProject?.id changes
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
        />
      );
    case "REVIEW_PROSPECTS":
      return <ArchetypeFilters hideFeature={true} />;
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
        <Sequences
          key={currentProject?.id} // Adding key to force re-render when currentProject?.id changes
          forcedCampaignId={currentProject?.id}
          setSequences={setSequences}
          setEmailSubjectLines={setEmailSubjectLines}
          emailSubjectLines={emailSubjectLines}
          setLinkedinInitialMessages={setLinkedinInitialMessages}
          linkedinInitialMessages={linkedinInitialMessages}
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

const SelinStrategy = ({
  messages,
  counter,
  setPrompt,
  handleSubmit,
  threads,
  currentSessionId,
}: {
  messages?: any[];
  setPrompt?: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit?: (file: any, message: string) => void;
  threads: ThreadType[];
  currentSessionId: Number | null;
  counter: Number;
}) => {
  const memory = threads.find((thread) => thread.id === currentSessionId)
    ?.memory;

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
          Blueprint:{" "}
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
                This blueprint summarizes the angle for your campaign. Review
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
