// Auto-derived from Google Drive: "AI Base³ Nexus Brand OS / Official_Certifications".
// Page 1 of each PDF rendered to /public/media/certifications/*.jpg.

export interface OfficialCertification {
  file: string;      // image filename in /media/certifications/
  title: string;     // display title
  issuer: string;    // issuing organization
  driveId: string;   // Google Drive file ID (source PDF)
  date?: string;     // completion / issue date (optional)
}

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;
export const driveViewUrl = drive;

export const OFFICIAL_CERTIFICATIONS: OfficialCertification[] = [
  { file: "Google_AI_Essentials.jpg", title: "Google AI Essentials", issuer: "Google", driveId: "1RNJ24pBlSTklp3mbiSw7O2Vta78dcx_M" },
  { file: "Google_AI_Pro.jpg", title: "Google AI Pro", issuer: "Google", driveId: "14TTd4Swp5TJ-SPtdpN0kx9B8d26bTRyA" },
  { file: "Google_AI_Fundamentals.jpg", title: "Google AI Fundamentals", issuer: "Google", driveId: "1DcOxWps1HTWFFVnN4ra7CVmhbh0i-hCS" },
  { file: "Google_Prompting_Master.jpg", title: "Google Prompting Master", issuer: "Google", driveId: "1v_1wvEGk8M3L26yFwq1Wb3tHhP9iqWko" },
  { file: "Google_Prompt_Master.jpg", title: "Google Prompt Master", issuer: "Google", driveId: "1KRFpGE3QyYOrIhqShtYMEwn3vYbPNhuo" },
  { file: "Google_Responsible_AI_1.jpg", title: "Google Responsible AI I", issuer: "Google", driveId: "1a07jHwUmLONQKXmkqisbpQryoDSqSm5D" },
  { file: "Google_Responsible_AI_II.jpg", title: "Google Responsible AI II", issuer: "Google", driveId: "1LWtafDfxZGVV-SV3omCHiFOZ_bZ8561Z" },
  { file: "Google_Gen_AI.jpg", title: "Google Gen AI", issuer: "Google", driveId: "1iVQgjIhOGYAnXsgL4cEV9FnoFgLSi99C" },
  { file: "Google_Gen_AI_Apps_4Work.jpg", title: "Google Gen AI Apps for Work", issuer: "Google", driveId: "1DJJ0h7aevvHxXRaD0R3Jni50i9OVSuIc" },
  { file: "Google_Gen_AI_Navigating.jpg", title: "Google Gen AI — Navigating", issuer: "Google", driveId: "17ibwuExfREup7RJyivEQbSJRC8t62pC9" },
  { file: "Google_Gen_AI_Agents_Organization.jpg", title: "Google Gen AI Agents in the Organization", issuer: "Google", driveId: "1PLHfsFSfjOWvQ0vJp4oG2-XVsX6WMzuu" },
  { file: "Google_LLMs.jpg", title: "Google Large Language Models", issuer: "Google", driveId: "1-idnGTELRI5akGnOv4fKnUVUaIXWZGaf" },
  { file: "Google_Beyond_Chatbots.jpg", title: "Google Beyond Chatbots", issuer: "Google", driveId: "117gXzMgm4Rd5BvvCf8TGjpYZTHNJ5F8Y" },
  { file: "Google_Unlocking_Concepts.jpg", title: "Google Unlocking Concepts", issuer: "Google", driveId: "1c_RMvQolfNMRY60QhxI5RITChtiARrgE" },
  { file: "Google_Transfer_Skills.jpg", title: "Google Transfer Skills", issuer: "Google", driveId: "1qzzglivn0apf7XnAnT43gY2BV_j2Puit" },
  { file: "Google_AI_Everyday_Work_Tasks.jpg", title: "Google AI — Everyday Work Tasks", issuer: "Google", driveId: "1o-eq2GVpQM1pz7IkHg9td03ZG96GpxXH" },
  { file: "Google_AI_Brainstorming_&_Planning.jpg", title: "Google AI — Brainstorming & Planning", issuer: "Google", driveId: "1PZmpeyzizHR4M12x3VI0h80jUl9Jb5zW" },
  { file: "Google_AI_Research.jpg", title: "Google AI — Research", issuer: "Google", driveId: "1Kbcs0i3WnfC_OZnFaQI3pPwshEkGZVIe" },
  { file: "Google_AI_Communication_&_Writing.jpg", title: "Google AI — Communication & Writing", issuer: "Google", driveId: "1BHY94k-IDAnI_sIYPEck2ra2PpXqzLbQ" },
  { file: "Google_AI_Creative_Expert_.jpg", title: "Google AI Creative Expert", issuer: "Google", driveId: "1qldAEYkU7nmWFgjkYAh-hU267HO7ay25" },
  { file: "Google_AI_App_Building.jpg", title: "Google AI — App Building", issuer: "Google", driveId: "1t-2fWrumiHj8sxQ74rhkUjuo91PeEtTq" },
  { file: "Google_Content_Creation.jpg", title: "Google Content Creation", issuer: "Google", driveId: "1M8FizMsQPM2yEcI8eX3wTHPNGSpEJk7W" },
  { file: "Google_Data_Analysis.jpg", title: "Google Data Analysis", issuer: "Google", driveId: "12D5sSOC3EqJs8yMYi8HiijELkXkL8CW6" },
  { file: "Google_Data_Analysis_Presentation_Building.jpg", title: "Google Data Analysis & Presentation Building", issuer: "Google", driveId: "1k82SOdlRn1B-rdpLmDcIPvCH-3lE2Tda" },
  { file: "Google_UX_Design.jpg", title: "Google UX Design", issuer: "Google", driveId: "1GyIgykU4pRl61bgCu7hx15T8bE2poOoj" },
  { file: "Gen_AI_Learning_Path.jpg", title: "Gen AI Learning Path", issuer: "Google", driveId: "1rs8T-iz25ZXC53QvaoCosQ-Rqx4Z40_Q" },
  { file: "Gemini_Master.jpg", title: "Gemini Master", issuer: "Google", driveId: "1gMSr2wXAYAR1HgWIiC3UO_q9r1XdyKMl" },
  { file: "Anthropic_Claude_Master.jpg", title: "Anthropic Claude Master", issuer: "Anthropic", driveId: "1o-YDwLDCoTn_eYnC233tEmcv7HREwaHd" },
  { file: "Anthropic_Claude_Collaboration.jpg", title: "Anthropic Claude Collaboration", issuer: "Anthropic", driveId: "1O1jvQ-uPzo9SqQsgCPM0zSdneixHneX-" },
  { file: "Claude_Master.jpg", title: "Claude Master", issuer: "Anthropic", driveId: "1eoWlt8mapnPYtKhBSKE4zg-kutpL0tm-" },
  { file: "ChatGTP_Master.jpg", title: "ChatGPT Master", issuer: "OpenAI", driveId: "1hF-okX9_KVPytCpjFtffztNv5Gdd51d5" },
  { file: "ChatGTP_Deepdive_Master.jpg", title: "ChatGPT Deep-Dive Master", issuer: "OpenAI", driveId: "1NHHaiQNcnKTga3CqUYFwNyUB38zrd8iP" },
  { file: "Perplexity_Master.jpg", title: "Perplexity Master", issuer: "Perplexity", driveId: "1QNOpRdfkNKuRnO2ICOVHf3z4xU71UqHn" },
  { file: "Midjourney_Master.jpg", title: "Midjourney Master", issuer: "Midjourney", driveId: "1JxU8xUS3ogMCv_PSJrCGypI4eZ_BtjLu" },
  { file: "StableDiffusion_Master.jpg", title: "Stable Diffusion Master", issuer: "Stability AI", driveId: "17wC1AWFl7mhXlIFiqRWck1ksznoi9Zoo" },
  { file: "Jasper_Master.jpg", title: "Jasper Master", issuer: "Jasper", driveId: "19dnd6IXi4ROGMVm4-R_iCDHDwfDcojbZ" },
  { file: "Lovable_Master.jpg", title: "Lovable Master", issuer: "Lovable", driveId: "1KZHMVXq85g1VWcBlfYPxg_jDnzaRuWZV" },
  { file: "Coursera_3BWZ2J6K2JH7.jpg", title: "Coursera Certificate", issuer: "Coursera", driveId: "1LZ-RpDejP_s9nazj2LgFZhAln7X3MSaX" },
];
