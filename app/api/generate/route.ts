import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是一位专业的求职面试准备顾问，拥有10年+面试辅导经验。
你的输出要精准、实用、有针对性——不说废话，每一条都要直接可用。
要求：
- 所有内容必须中文
- 开场自我介绍必须自然流畅，像真人说话
- 预测题要基于 JD 和行业真实面试风格
- STAR 故事必须来自简历的真实经历，不能编造
- 如果没有简历，STAR 部分给出通用框架和填空模板`;

const CHEATSHEET_PROMPT = `根据候选人的简历和目标岗位，生成一份精准的面试准备小抄。

目标岗位：
公司：{company}
岗位：{role}
职位描述：
{jd}

{resume_section}

请严格按以下 JSON 格式返回（只返回 JSON，不要 markdown 代码块，不要其他说明）：

{
  "company_intel": {
    "culture_keywords": ["企业文化关键词1", "关键词2", "关键词3"],
    "interview_style": "这家公司的面试风格特点（1-2句话）",
    "recent_focus": "该岗位/部门近期可能关注的方向"
  },
  "opening_pitch": "为这个岗位定制的30秒自我介绍，直接可用，突出与岗位最相关的背景。必须口语化，像跟面试官自然聊天。",
  "job_core_requirements": [
    {"req": "核心要求1（简短）", "detail": "面试中会怎么考察这个要求", "weight": "高/中"},
    {"req": "核心要求2", "detail": "...", "weight": "高/中"},
    {"req": "核心要求3", "detail": "...", "weight": "高/中"}
  ],
  "match_points": [
    {"your_bg": "简历中的具体经历或技能", "connects_to": "如何直接对应岗位需求", "gap": "如有差距，如何弥补（可选）"},
    {"your_bg": "...", "connects_to": "...", "gap": ""},
    {"your_bg": "...", "connects_to": "...", "gap": ""}
  ],
  "key_questions": [
    {"q": "预测问题1", "type": "Behavioral/Case/Technical/Motivational", "angle": "这道题真正考察什么", "answer_frame": "建议答题思路（2-3句话框架）"},
    {"q": "预测问题2", "type": "...", "angle": "...", "answer_frame": "..."},
    {"q": "预测问题3", "type": "...", "angle": "...", "answer_frame": "..."},
    {"q": "预测问题4", "type": "...", "angle": "...", "answer_frame": "..."},
    {"q": "预测问题5", "type": "...", "angle": "...", "answer_frame": "..."},
    {"q": "预测问题6", "type": "...", "angle": "...", "answer_frame": "..."}
  ],
  "star_stories": [
    {
      "title": "故事标题（来自简历的具体经历）",
      "s": "背景（1句话）",
      "t": "任务/挑战（1句话）",
      "a": "你做了什么（2-3句，重点说行动和决策）",
      "r": "结果（尽量量化）",
      "use_for": ["适合回答的问题类型1", "类型2"]
    },
    {
      "title": "故事标题2",
      "s": "...", "t": "...", "a": "...", "r": "...",
      "use_for": ["..."]
    },
    {
      "title": "故事标题3",
      "s": "...", "t": "...", "a": "...", "r": "...",
      "use_for": ["..."]
    }
  ],
  "questions_to_ask": [
    {"q": "你问面试官的问题", "why": "为什么问这个（展示了什么）", "timing": "适合在哪轮问"},
    {"q": "问题2", "why": "...", "timing": "..."},
    {"q": "问题3", "why": "...", "timing": "..."}
  ],
  "danger_zones": [
    {"zone": "可能的雷区/陷阱", "how_to_handle": "应对策略"}
  ],
  "custom_tips": [
    "针对这个公司/岗位的专属提醒1",
    "提醒2",
    "提醒3"
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { company, role, jd, resumeText, accessCode } = await req.json();

    // Verify access code
    const validCode = (process.env.ACCESS_CODE || "lemontalk2026").trim();
    if (!accessCode || accessCode.trim() !== validCode) {
      return NextResponse.json({ error: `访问码无效` }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "服务端未配置 API Key" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const resumeSection = resumeText?.trim()
      ? `候选人简历：\n${resumeText.trim()}`
      : "（未提供简历。STAR 故事部分请给出通用模板框架，标注[请填入你的经历]。其他部分正常生成。）";

    const prompt = CHEATSHEET_PROMPT
      .replace("{company}", company || "未知公司")
      .replace("{role}", role || "未知岗位")
      .replace("{jd}", jd?.trim() || "（未提供详细JD）")
      .replace("{resume_section}", resumeSection);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 5000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    let raw = (response.content[0] as { type: "text"; text: string }).text.trim();
    if (raw.startsWith("```")) {
      const lines = raw.split("\n");
      raw = lines.slice(1, -1).join("\n");
    }

    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
