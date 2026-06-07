export enum CommType {
  CHAT = 1,
  EMOTE = 2,
  REACTION = 3,
  QUICK = 4,
  TEAM_CHAT = 5,
  PROXIMITY = 6,
}

export interface BaseMessage {
  sender: string;
  time: number;
}

export interface ChatPayload {
  text: string;
}

export interface EmotePayload {
  emote: string;
}

export interface ReactionPayload {
  reaction: string;
  target?: string;
}

export interface QuickPayload {
  quick: string;
}

export interface TeamChatPayload {
  text: string;
}

export interface ProximityPayload {
  proximity: string;
}
