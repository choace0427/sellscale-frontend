declare module "react-render-html";
export interface MsgResponse {
  status: "success" | "error";
  title: string;
  message: string;
  data?: any;
}

export interface Campaign {
  uuid: string;
  id: number;
  name: string;
  prospect_ids: number[];
  campaign_type: Channel;
  ctas: number[];
  client_archetype_id: number;
  client_sdr_id: number;
  campaign_start_date: Date;
  campaign_end_date: Date;
  analytics_sent: number;
  analytics_open_rate: number;
  analytics_reply_rate: number;
  analytics_demo_count: number;
  num_acceptances: number;
  num_replies: number;
  num_demos: number;
  demos: list;
  status:
    | "PENDING"
    | "NEEDS_REVIEW"
    | "IN_PROGRESS"
    | "INITIAL_EDIT_COMPLETE"
    | "READY_TO_SEND"
    | "COMPLETE"
    | "CANCELLED";
}

export interface Sequence {
  id: number;
  title: string;
  client_sdr_id: number;
  archetype_id: number;
  data: { subject: string; body: string }[];
  status: string;
}

export interface Prospect {
  approved_outreach_message_id: number | null;
  approved_prospect_email_id: number | null;
  archetype_id: number;
  batch: string;
  client_id: number;
  client_sdr_id: number;
  company: string;
  company_url: string;
  deactivate_ai_engagement: boolean;
  email: string;
  employee_count: string;
  first_name: string;
  full_name: string;
  id: number;
  industry: string;
  is_lead: null;
  last_name: string;
  last_position: null;
  last_reviewed: Date;
  li_conversation_thread_id: string;
  li_is_last_message_from_sdr: boolean;
  li_last_message_from_prospect: string;
  li_last_message_from_sdr: string;
  li_last_message_timestamp: string;
  li_unread_messages: number | null;
  email_is_last_message_from_sdr: boolean | null;
  email_last_message_from_prospect: string | null;
  email_last_message_from_sdr: string | null;
  email_last_message_timestamp: string | null;
  email_unread_messages: number | null;
  linkedin_bio: string | null;
  linkedin_url: string;
  times_bumped: null;
  title: string;
  twitter_url: string | null;
  overall_status: string;
  linkedin_status: string;
  email_status: string;
  img_url: string;
  img_expire: string;
  recent_messages: any;
  hidden_until: string;
  hidden_reason: string;
  demo_date: any;
  icp_fit_score: number;
  icp_fit_reason: string;
  icp_fit_error: string;
  archetype_name: string;
  pipeline_notifications_webhook_url: string;
}

export interface ProspectShallow {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  email: string;
  icp_fit_score: number;
  icp_fit_reason: string;
  li_public_id: string | null;
  img_url: string;
  archetype_id: number;
  hidden_until: string;
  hidden_reason: string;
  demo_date: string;
  deactivate_ai_engagement: boolean;
  is_lead: boolean;
  overall_status: string;
  linkedin_status: string;
  email_status: string;
  li_urn_id: string;
  li_conversation_urn_id: string;
  li_last_message_timestamp: string;
  li_is_last_message_from_sdr: boolean;
  li_last_message_from_prospect: string;
  li_last_message_from_sdr: string;
  li_unread_messages: number;
  email_last_message_timestamp: string;
  email_is_last_message_from_sdr: boolean;
  email_last_message_from_prospect: string;
  email_last_message_from_sdr: string;
  email_unread_messages: number;
};

export interface Simulation {
  id: number;
  client_sdr_id: number;
  archetype_id: number;
  prospect_id: number;
  prospect?: Prospect;
  type: string;
  meta_data: Record<string, any>;
}

export interface CTA {
  id: number;
  archetype_id: number;
  active: boolean;
  text_value: string;
  expiration_date?: string;
  performance?: {
    status_map: Record<string, number>;
    total_count: number;
  };
}

export interface Archetype {
  active: boolean;
  archetype: string;
  client_id: number;
  client_sdr_id: number;
  disable_ai_after_prospect_engaged: boolean;
  filters: null; // TODO:
  id: number;
  performance: {
    status_map: Record<string, number>;
    total_prospects: number;
  };
  transformer_blocklist: null; // TODO:
  vessel_sequence_id: number;
  uploads?: any[];
  icp_matching_prompt: string;
  is_unassigned_contact_archetype: boolean;
  ctas: CTA[];
}

export interface PersonaOverview {
  active: boolean;
  id: number;
  name: string;
  num_prospects: number;
  num_unused_email_prospects: number;
  num_unused_li_prospects: number;
  icp_matching_prompt: string;
  is_unassigned_contact_archetype: boolean;
  uploads?: any[];
}

export interface LinkedInMessage {
  author: string;
  connection_degree: string;
  conversation_url: string;
  date: string;
  first_name: string;
  last_name: string;
  headline: string;
  img_url: string;
  li_url: string;
  message: string;
  profile_url: string;
  urn_id: string;
  ai_generated: boolean;
  bump_framework_id: number;
  bump_framework_title: string;
  bump_framework_description: string;
  bump_framework_length: string;
  account_research_points: string[],
  initial_message_id: number;
  initial_message_cta_id: number;
  initial_message_cta_text: string;
  initial_message_research_points: string[];
  initial_message_stack_ranked_config_id: number;
  initial_message_stack_ranked_config_name: string;
}

export interface EmailMessage {
  ai_generated: boolean | null;
  bcc: string[];
  body: string;
  cc: string[];
  client_sdr_id: number;
  date_received: string;
  email_conversation_thread_id: number;
  files: any[]
  from_prospect: boolean;
  from_sdr: boolean;
  id: number;
  message_from: {
    email: string;
    name: string;
  }[];
  message_to: {
    email: string;
    name: string;
  }[];
  nylas_message_id: string;
  nylas_thread_id: string;
  prospect_email: string;
  prospect_id: number;
  reply_to: string[];
  sdr_email: string;
  snippet: string;
  subject: string;
}

export interface ProspectNote {
  created_at: string;
  id: number;
  note: string;
  prospect_id: number;
}

export interface ProspectEmail extends Record<string, unknown> {
  email: string;
  subject: string;
  body: string;
  date: number;
  from: string;
}

export type Channel = "EMAIL" | "LINKEDIN" | "SELLSCALE";

export type BumpFramework = {
  id: number;
  title: string;
  description: string;
  overall_status: string;
  substatus: string;
  active: boolean;
  default: boolean;
  bump_length: string;
  bumped_count: number | null;
  bump_delay_days: number;
  use_account_research: boolean;
  client_archetype_id: number;
  // client_archetype_archetype: string;
  account_research?: string[];
  etl_num_times_used?: number;
  etl_num_times_converted?: number;
};

export type EmailBumpFramework = {
  id: number;
  title: string;
  email_blocks: string[];
  overall_status: string;
  substatus: string;
  active: boolean;
  default: boolean;
  bumped_count: number | null;
}

export type SalesNavigatorLaunch = {
  id: number,
  sales_navigator_config_id: number,
  client_sdr_id: number,
  sales_navigator_url: string,
  scrape_count: number,
  status: string,
  pb_container_id: string,
  result_available: boolean,
  launch_date: Date,
}