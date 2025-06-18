
// deno run -A main.ts     ← or deploy this as a Supabase Edge Function
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/* ────────── CORS ────────── */
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ────────── 14 POSITIVE  +  8 NEGATIVE MULTISHOTS ────────── */
const examples = [
  /* 1 ▸ Dharma */
  { role: "user", content: "What does the Bhagavad Gita say about dharma?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "The Gita defines dharma as one's sacred duty (svadharma). Krishna advises Arjuna that it is better to perform one's own dharma, even imperfectly, than another's perfectly (3.35). He adds that action must be done without attachment to results (2.47) and again exhorts sticking to one's ordained duty in the final chapter (18.47).",
      citations: [
        "Bhagavad Gita 3.35",
        "Bhagavad Gita 2.47",
        "Bhagavad Gita 18.47",
      ],
    }),
  },

  /* 2 ▸ Moksha */
  { role: "user", content: "Explain moksha in Hinduism." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Moksha is liberation from saṁsāra and realization of unity with Brahman. The Mundaka Upanishad states that one who knows the Supreme is freed from all bonds (3.2.9). Krishna describes the liberated soul as established in Brahman even at death (2.72). The Katha Upanishad calls moksha the supreme goal attained by realizing the Self beyond virtue and vice (2.3.14).",
      citations: [
        "Mundaka Upanishad 3.2.9",
        "Bhagavad Gita 2.72",
        "Katha Upanishad 2.3.14",
      ],
    }),
  },

  /* 3 ▸ Ātman */
  {
    role: "user",
    content: "What is ātman according to the Upanishads?",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Ātman is the innermost Self, eternal and unchanging. 'Tat tvam asi' (That thou art) declares the Chandogya Upanishad, equating individual Self with Brahman (6.8.7). The Brihadaranyaka Upanishad calls it the unseen seer (1.4.10). Krishna says the Self is unborn, indestructible, and cannot be slain (2.20).",
      citations: [
        "Chandogya Upanishad 6.8.7",
        "Brihadaranyaka Upanishad 1.4.10",
        "Bhagavad Gita 2.20",
      ],
    }),
  },

  /* 4 ▸ Four yogas */
  { role: "user", content: "Name the four yogas described in the Gita." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "The Gita presents Karma-yoga (selfless action, 3.3), Dhyāna/Rāja-yoga (meditative discipline, 6.18), Bhakti-yoga (loving devotion, 12.2) and Jñāna-yoga (knowledge-path culminating in God-realization, 18.55). They are complementary routes to the same goal.",
      citations: [
        "Bhagavad Gita 3.3",
        "Bhagavad Gita 6.18",
        "Bhagavad Gita 12.2",
        "Bhagavad Gita 18.55",
      ],
    }),
  },

  /* 5 ▸ Rudra */
  { role: "user", content: "Who is Rudra in the Vedas?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Rudra is a fierce yet healing deity in early Vedic hymns. Rig Veda 2.33 implores him for protection and medicine. The Śvetāśvatara Upanishad later hails Rudra as the one supreme reality realized by sages (3.2).",
      citations: [
        "Rig Veda 2.33.1-11",
        "Svetasvatara Upanishad 3.2",
      ],
    }),
  },

  /* 6 ▸ Viṣṇu avatāras */
  {
    role: "user",
    content: "List the principal avatāras of Viṣṇu.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Bhāgavata Purāṇa enumerates ten major descents: Matsya, Kūrma, Varāha, Narasiṁha, Vāmana, Paraśurāma, Rāma, Kṛṣṇa (with Balarāma or Buddha, depending on tradition) and Kalki (yet to come) (1.3.28-32). Viṣṇu Purāṇa repeats this list, noting avatāras manifest whenever dharma declines (3.1).",
      citations: [
        "Bhagavata Purana 1.3.28-32",
        "Vishnu Purana 3.1.45-61",
      ],
    }),
  },

  /* 7 ▸ Tapas */
  { role: "user", content: "What role does tapas play in Hindu practice?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Tapas is disciplined austerity that purifies and empowers. The Taittirīya Upanishad instructs, 'Seek to know Brahman through tapas' (3.1.1). Krishna classifies tapas of body, speech, and mind, adding it must be practiced without attachment (BhG 17.14-16).",
      citations: [
        "Taittiriya Upanishad 3.1.1",
        "Bhagavad Gita 17.14-16",
      ],
    }),
  },

  /* 8 ▸ Māyā */
  { role: "user", content: "Define māyā in Advaita philosophy." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Māyā is the power that makes non-dual Brahman appear as the pluralistic world. The Śvetāśvatara Upanishad says all beings are woven in the Lord like a spider's web (4.10) and urges: 'Know prakriti as māyā' (4.9). Krishna calls divine māyā hard to cross without surrendering to Him (BhG 7.14).",
      citations: [
        "Svetasvatara Upanishad 4.9",
        "Svetasvatara Upanishad 4.10",
        "Bhagavad Gita 7.14",
      ],
    }),
  },

  /* 9 ▸ Three guṇas */
  { role: "user", content: "Describe the three guṇas and their effects." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Prakriti comprises sattva (luminosity), rajas (activity), and tamas (inertia). Krishna explains sattva brings clarity, rajas fuels craving-driven action, tamas breeds negligence (BhG 14.5-17). The Sāṁkhya-kārikā likens their interplay to a lamp's flickering flame (kārikā 12). Liberation dawns when one transcends the guṇas (BhG 14.19-20).",
      citations: [
        "Bhagavad Gita 14.5-17",
        "Samkhya Karika 12",
        "Bhagavad Gita 14.19-20",
      ],
    }),
  },

  /* 10 ▸ Āśramas */
  { role: "user", content: "Explain the four āśramas (life stages)." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Hindu dharma outlines Brahmacarya (student), Gṛhastha (householder), Vānaprastha (retiree), and Sannyāsa (renunciant). Manusmṛti (6.1-3) prescribes duties for each. The Mahābhārata notes that any of these, performed selflessly, can lead to liberation (Śānti-parva 265.9).",
      citations: [
        "Manusmriti 6.1-3",
        "Mahabharata, Shanti Parva 265.9",
      ],
    }),
  },

  /* 11 ▸ Prāṇa */
  { role: "user", content: "What is prāṇa according to the Upanishads?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Prāṇa is the vital life-breath. In Praśna Upanishad, sages discover that all faculties depend on prāṇa (2.3-5). The Chandogya Upanishad calls it the deity dwelling in the body; when prāṇa departs, the senses follow (5.1.15).",
      citations: [
        "Prashna Upanishad 2.3-5",
        "Chandogya Upanishad 5.1.15",
      ],
    }),
  },

  /* 12 ▸ Karma- vs Jñāna-yoga */
  {
    role: "user",
    content: "Contrast karma-yoga and jñāna-yoga in the Gita.",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Karma-yoga is selfless action dedicated to God; it purifies the mind (3.3). Jñāna-yoga is contemplative insight culminating in direct realization (4.38). Krishna says both reach the same summit, yet action is easier for the restless (5.4-5). When perfected, the karma-yogin gains jñāna and acts without bondage (18.56).",
      citations: [
        "Bhagavad Gita 3.3",
        "Bhagavad Gita 4.38",
        "Bhagavad Gita 5.4-5",
        "Bhagavad Gita 18.56",
      ],
    }),
  },

  /* 13 ▸ 'Neti neti' */
  { role: "user", content: "Explain the doctrine of 'neti neti'." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "'Neti neti' (not this, not this) is an Upanishadic method of negation. Yājñavalkya teaches that the Self is to be known by negating all limited attributes (Br̥had 2.3.6). He repeats the formula while describing the ineffable Brahman (4.4.22). By discarding names and forms, the seeker intuits the formless substratum.",
      citations: [
        "Brihadaranyaka Upanishad 2.3.6",
        "Brihadaranyaka Upanishad 4.4.22",
      ],
    }),
  },

  /* 14 ▸ Om */
  { role: "user", content: "What is the significance of Om in Hindu texts?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "Om is the primordial sound. The entire Māṇḍūkya Upanishad analyses its three syllables—A, U, M—mapping them to waking, dream, and deep sleep states; the silence after represents Turiya, the fourth consciousness (1.1). Chandogya Upanishad calls Om the essence of all existence (1.1.1). Krishna identifies Himself with Om, the one-syllable Brahman (BhG 8.13).",
      citations: [
        "Mandukya Upanishad 1.1",
        "Chandogya Upanishad 1.1.1",
        "Bhagavad Gita 8.13",
      ],
    }),
  },

  /* ─── 8 NEGATIVE REFUSAL EXAMPLES ─── */
  { role: "user", content: "How do I solve a quadratic equation?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "Give me tips for losing weight." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "Who won the last Football World Cup?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "What is the capital of France?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "Explain Einstein's relativity." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "How do I cook pasta?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "What are the latest stock-market trends?" },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },

  { role: "user", content: "Tell me about Buddhism." },
  {
    role: "assistant",
    content: JSON.stringify({
      answer:
        "I don't know. I am only trained on Hindu scriptures and philosophy.",
      citations: [],
    }),
  },
];

/* ────────── SIMPLE MEMORY CACHE ────────── */
const memCache = new Map<string, string>();

/* ────────── SERVER HANDLER ────────── */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      throw new Error("No user message supplied.");
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY not set.");

    /* Cache lookup */
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(message),
    );
    const key = [...new Uint8Array(hash)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (memCache.has(key)) {
      return new Response(memCache.get(key)!, {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    /* Fixed max_tokens: Set to a reasonable minimum to ensure complete JSON responses */
    const maxTokens = Math.max(300, Math.min(1200, message.length * 2));

    const chatReq = {
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      top_p: 0.8,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content:
            "You are HinduGPT – an expert on Hindu scriptures and philosophy, capable of providing detailed, nuanced, and comprehensive answers. Answer ONLY from Hindu scriptures and established philosophical schools (Darshanas) within Hinduism.When addressing complex philosophical concepts, provide explanations derived from the interpretations and elaborations found in major commentaries (bhashyas), treatises (shastras), and the established arguments of the respective Darshanas (e.g., Advaita Vedanta, Samkhya, Nyaya, Yoga, Mimamsa, etc.), *even if the direct phrasing of the concept itself isn't explicitly a single verse in a Shruti text*. Always link these elaborations back to their foundational scriptural principles.For comparative questions, clearly articulate the perspectives of each relevant school.Always respond with valid JSON containing 'answer' (string) and 'citations' (array of strings).Citations MUST be exact scripture references (e.g., Upanishad Name X.Y.Z, Bhagavad Gita X.Y, Brahma Sutra X.X.X) or references to prominent foundational texts/commentaries for a specific Darshana when elaborating a concept (e.g., Patanjali's Yoga Sutras X.Y, Nyaya Sutras X.X.X, Shankara's Brahma Sutra Bhashya). If a direct verse is not available for a specific philosophical elaboration, explain the concept's grounding in the overall philosophy/Upanishadic teaching it interprets, and cite the broader philosophical school or the primary text of that school.Ensure answers are comprehensive, addressing all parts of the question, and explain subtle distinctions clearly.",
        },
        ...examples,
        { role: "user", content: message },
      ],
    };

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatReq),
      },
    );

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error(`OpenAI API error: ${openaiRes.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${openaiRes.status}`);
    }

    const data = await openaiRes.json();
    
    const content = data.choices[0].message.content;
    
    // Validate JSON before parsing
    let parsed;
    try {
      parsed = JSON.parse(content) as {
        answer: string;
        citations: string[];
      };
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Content that failed to parse:', content);
      // Fallback response
      parsed = {
        answer: "I apologize, but I'm unable to process your request at the moment. Please try again.",
        citations: [],
      };
    }

    /* On-topic guardrail */
    if (
      !/(Bhagavad|Upanishad|Ramayana|Mahabharata|Veda|Purana)/i.test(
        parsed.answer,
      )
    ) {
      parsed = {
        answer:
          "I don't know. I am only trained on Hindu scriptures and philosophy.",
        citations: [],
      };
    }

    const final = JSON.stringify(parsed);
    memCache.set(key, final);

    return new Response(final, {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("edge-function error:", err);
    return new Response(
      JSON.stringify({
        error: err.message,
        answer:
          "I apologize, but I'm unable to process your request at the moment.",
        citations: [],
      }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
