declare module "react-render-html";
export interface MsgResponse {
  status: "success" | "error";
  title: string;
  message: string;
  data?: any;
}

export interface ApolloScrape {
  id: number;
  archetype_id?: number;
  archetype_name?: string;
  segment_id?: number;
  segment_name?: string;
  name: string;
  page_num: number;
  page_size: number;
  max_pages?: number;
  filters: Record<string, any>;
  active: boolean;
}

export interface ActivityLog {
  client_sdr_id: number;
  created_at: string;
  description: string;
  id: number;
  name: string;
  sdr_name: string;
  type: string;
}

export interface SyncData {
  id: number;
  client_id: number;
  sync_type?: "leads_only" | "account_and_leads";
  status_mapping?: Record<string, any>; // TODO
  event_handlers?: {
    on_demo_set?: "create_lead" | "do_nothing";
  };
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

export interface Client {
  id: number;
  active: boolean;
  auto_generate_email_messages: boolean;
  auto_generate_li_messages: boolean;
  case_study: string;
  company: string;
  contact_email: string;
  contact_name: string;
  contract_size: number;
  description: string;
  domain: string;
  email_outbound_enabled: boolean;
  example_outbound_copy: string;
  existing_clients: string;
  impressive_facts: string;
  linkedin_outbound_enabled: boolean;
  mission: string;
  pipeline_notifications_webhook_url: string;
  pipeline_microsoft_teams_notifications_webhook_url: string;
  slack_bot_connected: boolean;
  slack_bot_connecting_user_name: string;
  tagline: string;
  tone_attributes: string;
  value_prop_key_points: string;
  channel_name: string;
  channel_id: string;
}

export interface ClientSDR {
  id: number;
  active: boolean;
  auto_archive_convos: boolean;
  auto_bump: boolean;
  auto_calendar_sync: boolean;
  auto_generate_messages: boolean;
  auto_send_email_campaign: boolean;
  auto_send_linkedin_campaign: boolean;
  avg_contract_size: number;
  blacklisted_words: string[];
  browser_extension_ui_overlay: boolean;
  calendly_connected: boolean;
  case_study: string;
  emails: any[];
  client: Client;
  client_name: string;
  conversion_demo_pct: number;
  conversion_open_pct: number;
  conversion_percentages: Record<string, number>;
  conversion_reply_pct: number;
  conversion_sent_pct: number;
  default_transformer_blocklist: string[];
  disable_ai_on_message_send: boolean;
  disable_ai_on_prospect_respond: boolean;
  do_not_contact_company_names: string[];
  do_not_contact_keywords: string[];
  email_fetching_credits: number;
  email_link_tracking_enabled: boolean;
  email_open_tracking_enabled: boolean;
  id: number;
  img_expire: string;
  img_url: string;
  individual_id: number;
  last_li_conversation_scrape_date: string;
  li_connected: boolean;
  li_cover_img_url: string;
  li_health: number;
  li_health_cover_image: boolean;
  li_health_good_title: boolean;
  li_health_premium: boolean;
  li_health_profile_photo: boolean;
  li_voyager_connected: boolean;
  linkedin_url: string;
  merge_user_id: string;
  message_generation_captivate_mode: boolean;
  meta_data: Record<string, any>;
  ml_credits: number;
  nylas_connected: boolean;
  onboarded: boolean;
  pipeline_notifications_webhook_url: string;
  scheduling_link: string;
  sdr_email: string;
  sdr_name: string;
  sdr_title: string;
  role: "ADMIN" | "MEMBER";
  auth_token: string;
  sla_schedules: Record<string, any>[];
  slack_user_id: string;
  timezone: string;
  unassigned_persona_id: number;
  warmup_linkedin_complete: boolean;
  weekly_email_outbound_target: number;
  weekly_li_outbound_target: number;
  client_sync_crm: ClientSyncCRM;
  unread_inbox_messages?: number;
}

export interface Prospect {
  approved_outreach_message_id: number | null;
  approved_prospect_email_id: number | null;
  archetype_id: number;
  batch: string;
  client_id: number;
  client_sdr_id: number;
  location: string;
  company: string;
  company_url: string;
  company_hq: string;
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
  valid_primary_email: boolean;
  img_url: string;
  img_expire: string;
  recent_messages: any;
  hidden_until: string;
  hidden_reason: string;
  demo_date: any;
  icp_fit_score: number;
  icp_prospect_fit_score: number;
  icp_fit_reason: string;
  icp_fit_error: string;
  archetype_name: string;
  pipeline_notifications_webhook_url: string;
  in_icp_sample: boolean | null;
  icp_fit_score_override: number | null;
  email_store: EmailStore;
  contract_size: number;
  matched_filter_words?: string[];
  matched_filters?: string[];
  meta_data?: Record<string, any>;

  icp_company_fit_score: number;
  // putting string for now
  icp_fit_reason_v2: ICPFitReasonV2;
  icp_company_fit_reason: ICPFitReasonV2;
}

export interface ICPFitReasonV2 {
  [key: string]: {
    answer: string;
    reasoning: string;
    source: string;
    last_run?: string;
    question?: string;
  };
}

export interface IScraperProspect {
  awards: any[];
  background_image: string;
  birth_date: any;
  certifications: {
    authority: string;
    company: {
      id: any;
      logo: string;
      name: string;
      url: any;
    };
    date: {
      end: {
        day: any;
        month: any;
        year: any;
      };
      start: {
        day: any;
        month: number;
        year: number;
      };
    };
    display_source: string;
    license_number: string;
    name: string;
    url: string;
  }[];
  contact_info: {
    email: any;
    phone_numbers: any[];
    twitter: any;
    websites: {
      type: string;
      url: string;
    }[];
  };
  courses: any[];
  education: {
    date: {
      end: {
        day: any;
        month: any;
        year: any;
      };
      start: {
        day: any;
        month: any;
        year: any;
      };
    };
    degree_name: any;
    description: any;
    field_of_study: string;
    grade: any;
    school: {
      logo: string;
      name: string;
      url: string;
    };
  }[];
  entity_urn: string;
  first_name: string;
  industry: string;
  influencer: boolean;
  languages: {
    primary_locale: {
      country: string;
      language: string;
    };
    profile_languages: any[];
    supported_locales: {
      country: string;
      language: string;
    }[];
  };
  last_name: string;
  location: {
    city: any;
    country: any;
    default: string;
    short: string;
    state: any;
  };
  network_info: {
    connections_count: number;
    followable: boolean;
    followers_count: number;
  };
  object_urn: number;
  open_to_work: boolean;
  organizations: any[];
  patents: any[];
  position_groups: {
    company: {
      employees: {
        end: any;
        start: any;
      };
      id: any;
      logo: any;
      name: string;
      url: any;
    };
    date: {
      end: {
        day: any;
        month: any;
        year: any;
      };
      start: {
        day: any;
        month: number;
        year: number;
      };
    };
    profile_positions: {
      company: string;
      date: {
        end: {
          day: any;
          month: any;
          year: any;
        };
        start: {
          day: any;
          month: number;
          year: number;
        };
      };
      description: string;
      employment_type: any;
      location: string;
      title: string;
    }[];
  }[];
  premium: boolean;
  profile_id: string;
  profile_picture: string;
  profile_type: string;
  projects: any[];
  publications: any[];
  related_profiles: {
    background_image: any;
    first_name: string;
    last_name: string;
    profile_id: string;
    profile_picture: string;
    sub_title: string;
  }[];
  skills: string[];
  sub_title: string;
  summary: string;
  test_scores: any[];
  treasury_media: any[];
  volunteer_experiences: {
    cause: string | null;
    company: {
      id: any;
      logo: string | null;
      name: string;
      url: string | null;
    };
    date: {
      end: {
        day: any;
        month: any;
        year: any;
      };
      start: {
        day: any;
        month: any;
        year: any;
      };
    };
    description: string | null;
    role: string;
  }[];
}

export interface ProspectShallow {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  client_sdr_name?: string;
  client_sdr_img_url?: string;
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
  in_icp_sample: boolean | null;
  icp_fit_score_override: number | null;
  contract_size: number;
  meta_data?: Record<string, any>;
  merge_contact_id?: string;
  merge_account_id?: string;
  merge_opportunity_id?: string;
  merge_lead_id?: string;
  avatar?: string;
  approved_outreach_message_id?: number;
  approved_prospect_email_id?: number;
  generatedText?: string;
}

export interface ProspectICP {
  company: string;
  full_name: string;
  icp_fit_reason: string;
  icp_fit_score: number;
  id: number;
  industry: string;
  linkedin_url: string;
  title: string;
  email: string;
  status: string;
  has_been_sent_outreach: boolean;
  valid_primary_email: boolean;
}

export interface ProspectDetails {
  details: {
    id: number;
    full_name: string;
    title: string;
    company: string;
    address: string;
    status: string;
    overall_status: string;
    linkedin_status: string;
    bump_count: number;
    previous_status?: string;
    icp_fit_score: number;
    icp_fit_reason: string;
    email_status: string;
    profile_pic: string;
    ai_responses_disabled: boolean;
    notes: any[];
    persona: string;
    persona_id: number;
    demo_date: string;
    disqualification_reason?: string;
    last_message_from_prospect?: string;
    segment_title?: string;
  };
  data: Prospect;
  li: {
    li_conversation_url: string;
    li_conversation_thread: string;
    li_profile: string;
  };
  email: {
    email: string;
    email_status: string;
  };
  company: {
    logo: string;
    name: string;
    location: string;
    tags: string[];
    tagline: string;
    description: string;
    url: string;
    employee_count: string;
  };
  referrals: { id: number; full_name: string }[];
  referred: { id: number; full_name: string }[];
  phone: {
    phone_number?: string;
    reveal_phone_number: boolean;
  };
}

export interface DemoFeedback {
  client_id: number;
  client_sdr_id: number;
  demo_date: string;
  feedback: string;
  id: number;
  prospect_id: number;
  prospect_img_url: string;
  prospect_name: string;
  rating: string;
  status: string;
  demo_date: Date;
  next_demo_date: Date;
  ai_adjustments?: string;
}

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
    num_sent: number;
    num_converted: number;
  };
  cta_type: string;
  auto_mark_as_scheduling_on_acceptance: boolean;
}

export interface DefaultVoices {
  id: number;
  count_ctas: number;
  count_bumps: number;
  title: string;
  description: string;
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
  uploads?: any[];
  icp_matching_prompt: string;
  is_unassigned_contact_archetype: boolean;
  ctas: CTA[];
  contract_size: number;
  emoji: string;
  client_sdr_name?: string;
}

export interface PersonaOverview {
  active: boolean;
  ai_researcher_id?: number;
  ai_voice_id?: number;
  id: number;
  name: string;
  num_prospects: number;
  num_unused_email_prospects: number;
  num_unused_li_prospects: number;
  icp_matching_prompt: string;
  icp_matching_option_filters: Record<string, boolean>;
  is_unassigned_contact_archetype: boolean;
  persona_fit_reason: string;
  persona_contact_objective: string;
  uploads?: any[];
  contract_size: number;
  transformer_blocklist?: string[];
  transformer_blocklist_initial?: string[];
  emoji: string;
  avg_icp_fit_score: number;
  li_bump_amount: number;
  cta_framework_company: string;
  cta_framework_persona: string;
  cta_framework_action: string;
  use_cases: string;
  email_seq_generation_in_progress?: boolean;
  li_seq_generation_in_progress?: boolean;
  filters: string;
  lookalike_profile_1: string;
  lookalike_profile_2: string;
  lookalike_profile_3: string;
  lookalike_profile_4: string;
  lookalike_profile_5: string;
  template_mode: boolean;
  smartlead_campaign_id?: number;
  meta_data?: Record<string, any>;
  first_message_delay_days?: number;
  linkedin_active?: boolean;
  email_active?: boolean;
  email_open_tracking_enabled: boolean;
  email_link_tracking_enabled: boolean;
  email_to_linkedin_connection?: string;
  linkedin_to_email_connection?: string;
  archetype?: string;
  setup_status: string;
  sdr_name?: string;
  created_at: Date;
  updated_at: Date;
  testing_volume?: number;
  is_ai_research_personalization_enabled: boolean;
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
  account_research_points: string[];
  initial_message_id: number;
  initial_message_cta_id: number;
  initial_message_cta_text: string;
  initial_message_research_points: string[];
  initial_message_stack_ranked_config_id: number;
  initial_message_stack_ranked_config_name: string;
  is_sending?: boolean;
}

export interface EmailThread {
  client_sdr_id: number;
  first_message_timestamp: string;
  has_attachments: boolean;
  id: number;
  last_message_received_timestamp: string;
  last_message_sent_timestamp: string;
  last_message_timestamp: string;
  nylas_data_raw: {};
  nylas_message_ids: string[];
  nylas_thread_id: string;
  participants: {
    email: string;
    name: string;
  }[];
  prospect_email: string;
  prospect_id: number;
  sdr_email: string;
  snippet: string;
  subject: string;
  unread: boolean;
  version: number;
}

export interface EmailMessage {
  ai_generated: boolean | null;
  bcc: string[];
  body: string;
  cc: string[];
  client_sdr_id: number;
  date_received: string;
  email_conversation_thread_id: number;
  files: any[];
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

export type Channel = "EMAIL" | "LINKEDIN" | "SELLSCALE" | "SMARTLEAD";

export type BumpFramework = {
  id: number;
  title: string;
  created_at: Date;
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
  client_archetype_archetype: string;
  account_research?: string[];
  etl_num_times_used?: number;
  etl_num_times_converted?: number;
  transformer_blocklist: string[];
  active_transformers: string[];
  additional_context?: string;
  bump_framework_template_name?: string;
  bump_framework_human_readable_prompt?: string;
  human_feedback?: string;
  Title?: string;
  Description?: string;
  bump_id?: number;
  assets?: Record<string, any>[];
};

export type EmailSequenceStep = {
  step: {
    id: number;
    title: string;
    template: string;
    overall_status: string;
    substatus: string;
    active: boolean;
    default: boolean;
    bumped_count: number | null;
    sequence_delay_days: number | null;
    transformer_blocklist: string[];
    times_used: number;
    times_accepted: number;
    times_replied: number;
  };
  assets: Record<string, any>[];
};

export type ResearchPointType = {
  active: booelan;
  client_id?: number;
  client_sdr_id?: number;
  description: string;
  function_name: string;
  id: number;
  name: string;
};

export type EmailReplyFramework = {
  id: number;
  title: string;
  description: string;
  client_sdr_id: number;
  client_archetype_id: number;
  overall_status: string;
  substatus: string;
  template: string;
  additional_instructions: string;
  times_used: number;
  times_accepted: number;
  active: boolean;
  research_blocklist: string[];
  use_account_research: boolean;
};

export type SubjectLineTemplate = {
  id: number;
  subject_line: string;
  client_sdr_id: number;
  client_archetype_id: number;
  client_archetype_archetype: string;
  active: boolean;
  times_used: number;
  times_accepted: number;
  sellscale_generated: boolean;
  is_magic_subject_line: boolean | null;
};

export type SpamScoreResults = {
  read_minutes: number;
  read_minutes_score: number;
  spam_word_score: number;
  spam_words: string[];
  total_score: number;
};

export type SalesNavigatorLaunch = {
  id: number;
  sales_navigator_config_id: number;
  client_sdr_id: number;
  sales_navigator_url: string;
  scrape_count: number;
  status: string;
  segment_id?: number;
  segment_title?: string;
  pb_container_id: string;
  result_available: boolean;
  launch_date: Date;
  name: string;
  client_archetype_id: number;
  account_filters_url: string;
  archetype: string;
};

export type EmailStore = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  hunter_status: string;
  hunter_score: number;
  hunter_regexp: boolean;
  hunter_gibberish: boolean;
  hunter_disposable: boolean;
  hunter_webmail: boolean;
  hunter_mx_records: boolean;
  hunter_smtp_server: boolean;
  hunter_smtp_check: boolean;
  hunter_accept_all: boolean;
  hunter_block: boolean;
  hunter_sources: {}[];
};

export interface Individual {
  id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  bio: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  li_public_id: string | null;
  li_urn_id: string | null;
  img_url: string | null;
  img_expire: number;
  industry: string | null;
  company: Company | null;
  followers: {
    linkedin: number | null;
    instagram: number | null;
    facebook: number | null;
    twitter: number | null;
  };
  birth_date: string | null; // Assuming it's a date string
  location: Record<string, any> | null;
  language: {
    country: string | null;
    locale: string | null;
  };
  skills: string[] | null;
  websites: Array<Record<string, any>> | null;
  education: {
    recent_school: string | null;
    recent_degree: string | null;
    recent_field: string | null;
    recent_start_date: string | null; // Assuming it's a date string
    recent_end_date: string | null; // Assuming it's a date string
    history: Array<Record<string, any>> | null;
  };
  patents: Array<Record<string, any>> | null;
  awards: Array<Record<string, any>> | null;
  certifications: Array<Record<string, any>> | null;
  organizations: Array<Record<string, any>> | null;
  projects: Array<Record<string, any>> | null;
  publications: Array<Record<string, any>> | null;
  courses: Array<Record<string, any>> | null;
  test_scores: Array<Record<string, any>> | null;
  work: {
    recent_title: string | null;
    recent_company: string | null;
    recent_start_date: string | null; // Assuming it's a date string
    recent_end_date: string | null; // Assuming it's a date string
    recent_description: string | null;
    recent_location: Record<string, any> | null;
    history: Array<Record<string, any>> | null;
  };
  volunteer: Array<Record<string, any>> | null;
  similar_profiles: Array<Record<string, any>> | null;
}

interface EmailTemplate {
  id: number;
  name: string;
  description: string | null;
  template: string;
  template_type: "SUBJECT_LINE" | "BODY";
  active: boolean;
  transformer_blocklist: string[] | null;
  tone: string | null;
  labels: string[] | null;
}

interface EmailWarming {
  id: number;
  email: string;
  name: string;
  status: string;
  total_sent: number;
  total_spam: number;
  warmup_reputation: string;
  sent_count: string;
  spam_count: string;
  inbox_count: string;
  warmup_email_received_count: string;
  stats_by_date: Record<string, any>[];
  percent_complete: number;
}

///////////////////////////////////////////////////////////////////
//                         Trigger Types                         //
///////////////////////////////////////////////////////////////////

interface Trigger {
  active: boolean;
  blocks: TriggerBlock[];
  client_archetype_id: number;
  description: string;
  emoji: string;
  id: number;
  interval_in_minutes: number;
  keyword_blacklist: Record<string, any>;
  last_run: string;
  name: string;
  next_run: string;
  trigger_config: Record<string, any>;
  trigger_type: string;
}

///////////////////////////////////////////////////////////////////

type TriggerBlockType = "SOURCE" | "FILTER" | "ACTION";
interface TriggerBlock {
  type: TriggerBlockType;
}

type TriggerSourceType =
  | "GOOGLE_COMPANY_NEWS"
  | "EXTRACT_PROSPECTS_FROM_COMPANIES";
type TriggerSourceData = {
  prospect_titles?: string[];
  company_query?: string;
};
interface TriggerSourceBlock extends TriggerBlock {
  type: "SOURCE";
  source: TriggerSourceType;
  data: TriggerSourceData;
}

type TriggerFilterCriteria = {
  prospect_titles?: string[];
  company_names?: string[];
  article_titles?: string[];
  article_snippets?: string[];
  prospect_query?: string;
  company_query?: string;
};
interface TriggerFilterBlock extends TriggerBlock {
  type: "FILTER";
  criteria: TriggerFilterCriteria;
}

type TriggerActionType = "SEND_SLACK_MESSAGE" | "UPLOAD_PROSPECTS";
type TriggerActionData = {
  slack_message?: Record<string, any>[] | string;
  slack_webhook_urls?: string[];
};
interface TriggerActionBlock extends TriggerBlock {
  type: "ACTION";
  action: TriggerActionType;
  data: TriggerActionData;
}

///////////////////////////////////////////////////////////////////

type TriggerInputType = "TEXT" | "NUMBER" | "JSON" | "BOOLEAN";
type TriggerInput = {
  type: TriggerInputType;
  keyLink: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
};

interface TriggerDisplayFramework {
  uuid?: string;
  type: TriggerBlockType;
  subType?:
    | TriggerSourceType
    | TriggerActionType
    | "FILTER_PROSPECTS"
    | "FILTER_COMPANIES";
  label: string;
  description: string;
  emoji: string;
  inputs: TriggerInput[];
}

///////////////////////////////////////////////////////////////////
//                                                               //
///////////////////////////////////////////////////////////////////

export type CRMStage = {
  created_at: string;
  field_mappings: Record<string, any>;
  id: string;
  modified_at: string;
  name: string;
  remote_data: any;
  remote_id: string;
  remote_was_deleted: boolean;
};

export type MergeIntegrationType = {
  id: string;
  integration: string;
  integration_slug: string;
  category: string;
  end_user_origin_id: string;
  end_user_organization_name: string;
  end_user_email_address: string;
  status: string;
  webhook_listener_url: string;
  is_duplicate: boolean;
};

export type ClientSyncCRM = {
  id: number;
  client_id: number;
  initiating_client_sdr_id: number;
  crm_type: string;
  status_mapping: Record<string, string>;
  event_handlers: Record<string, string>;
  lead_sync: boolean;
  contact_sync: boolean;
  account_sync: boolean;
  opportunity_sync: boolean;
};

export interface Domain {
  aws: boolean;
  aws_amplify_app_id: string;
  aws_autorenew_enabled: boolean;
  aws_domain_registration_job_id: string;
  aws_domain_registration_status: string;
  aws_hosted_zone_id: string;
  dkim_record: string;
  dkim_record_valid: boolean;
  dmarc_record: string;
  dmarc_record_valid: boolean;
  domain: string;
  domain_setup_tracker: any;
  email_banks: EmailBankItem[] | null;
  forward_to: string;
  forwarding_enabled: boolean;
  id: number;
  last_refreshed: string;
  spf_record: string;
  spf_record_valid: boolean;
  active: boolean;
}

export interface EmailBankItem {
  active: boolean;
  daily_limit: number;
  daily_sent_count: number;
  domain_details: {
    dkim_record_valid: boolean;
    dmarc_record_valid: boolean;
    forwarding_enabled: boolean;
    id: number;
    spf_record_valid: boolean;
  };
  email_address: string;
  email_type: "ANCHOR" | "SELLSCALE" | "ALIAS";
  id: number;
  nylas_account_id: string;
  nylas_active: boolean;
  nylas_auth_code: string;
  smartlead_reputation: number;
  smartlead_warmup_enabled: boolean;
  total_sent_count: number;
}
