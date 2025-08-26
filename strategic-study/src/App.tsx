import React, { useState } from "react"
import sample from "./data/sample.json"

type Flashcard = { id: string; question: string; answer: string; tags: string[] }
type Cloze = { id: string; text: string; answer: string }
type MCQ = { id: string; question: string; options: string[]; answer: string; explanation: string }
type MiniCase = { id: string; scenario: string; question: string; solution_steps: string[] }

type Concept = { term: string; definition: string; related_frameworks: string[] }
type FrameworkLink = { framework: string; applies_when: string; red_flags: string }
type Example = { title: string; setup: string; application: string; pitfall: string }
type ExamQ = { type: string; prompt: string; expected_points: string[] }
type Spaced = { date: string; focus: string; est_minutes: number }

type Data = {
  tldr?: string
  takeaways?: string[]
  concepts: Concept[]
  framework_links: FrameworkLink[]
  examples: Example[]
  exam_questions: ExamQ[]
  spaced_plan: Spaced[]
  flashcards: Flashcard[]
  cloze: Cloze[]
  mcq: MCQ[]
  mini_cases: MiniCase[]
}

const emptyData: Data = {
  tldr: "",
  takeaways: [],
  concepts: [],
  framework_links: [],
  examples: [],
  exam_questions: [],
  spaced_plan: [],
  flashcards: Array.isArray(sample.flashcards) ? sample.flashcards : [],
  cloze: Array.isArray(sample.cloze) ? sample.cloze : [],
  mcq: Array.isArray(sample.mcq) ? sample.mcq : [],
  mini_cases: Array.isArray(sample.mini_cases) ? sample.mini_cases : []
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <div className="card-body">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  )
}

export default function App() {
  const [raw, setRaw] = useState<string>(JSON.stringify(emptyData, null, 2))
  const [data, setData] = useState<Data>(emptyData)
  const [error, setError] = useState<string>("")
  const [mode, setMode] = useState<
    "summary" | "concepts" | "frameworks" | "examples" | "exam" | "plan" |
    "flashcards" | "cloze" | "mcq" | "cases"
  >("summary")

  function load() {
    try {
      const parsed = JSON.parse(raw)
      setData({
        tldr: parsed.tldr ?? "",
        takeaways: parsed.takeaways ?? [],
        concepts: parsed.concepts ?? [],
        framework_links: parsed.framework_links ?? [],
        examples: parsed.examples ?? [],
        exam_questions: parsed.exam_questions ?? [],
        spaced_plan: parsed.spaced_plan ?? [],
        flashcards: parsed.flashcards ?? [],
        cloze: parsed.cloze ?? [],
        mcq: parsed.mcq ?? [],
        mini_cases: parsed.mini_cases ?? []
      })
      setError("")
    } catch (e: any) {
      console.error(e)
      setError("Invalid JSON: " + e.message)
    }
  }

  const tabs = [
    "summary", "concepts", "frameworks", "examples", "exam", "plan",
    "flashcards", "cloze", "mcq", "cases"
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header>
        <p className="kicker">EMBA • Strategic Thinking</p>
        <h1 className="text-3xl font-bold">Interactive Study Coach</h1>
        <p className="text-gray-600">Load your dataset and study across all modes.</p>
      </header>

      {/* Loader */}
      <Section title="Load JSON">
        <textarea
          className="textarea h-48 font-mono text-sm"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary" onClick={load}>Load</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </Section>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((m) => (
          <button
            key={m}
            className={`btn ${mode === m ? "btn-primary" : ""}`}
            onClick={() => setMode(m as any)}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {mode === "summary" && <SummaryView tldr={data.tldr} takeaways={data.takeaways} />}
      {mode === "concepts" && <ConceptsView items={data.concepts} />}
      {mode === "frameworks" && <FrameworksView items={data.framework_links} />}
      {mode === "examples" && <ExamplesView items={data.examples} />}
      {mode === "exam" && <ExamView items={data.exam_questions} />}
      {mode === "plan" && <PlanView items={data.spaced_plan} />}
      {mode === "flashcards" && <FlashcardView cards={data.flashcards} />}
      {mode === "cloze" && <ClozeView cards={data.cloze} />}
      {mode === "mcq" && <MCQView cards={data.mcq} />}
      {mode === "cases" && <CaseView cases={data.mini_cases} />}
    </div>
  )
}

/* ---------------- Extra Views ---------------- */

function SummaryView({ tldr, takeaways }: { tldr?: string; takeaways?: string[] }) {
  return (
    <Section title="Summary">
      <p className="font-medium">{tldr}</p>
      <ul className="mt-4 list-disc list-inside">
        {takeaways?.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </Section>
  )
}

function ConceptsView({ items }: { items: Concept[] }) {
  return (
    <Section title="Concepts">
      <ul className="space-y-3">
        {items.map((c, i) => (
          <li key={i}>
            <p className="font-semibold">{c.term}</p>
            <p className="text-gray-700">{c.definition}</p>
            {c.related_frameworks?.length > 0 && (
              <p className="text-sm text-gray-500">Frameworks: {c.related_frameworks.join(", ")}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  )
}

function FrameworksView({ items }: { items: FrameworkLink[] }) {
  return (
    <Section title="Framework Links">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="text-left">
            <th>Framework</th><th>Applies When</th><th>Red Flags</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f, i) => (
            <tr key={i} className="border-t">
              <td>{f.framework}</td>
              <td>{f.applies_when}</td>
              <td>{f.red_flags}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function ExamplesView({ items }: { items: Example[] }) {
  return (
    <Section title="Examples">
      {items.map((ex, i) => (
        <div key={i} className="mb-4">
          <h3 className="font-semibold">{ex.title}</h3>
          <p><strong>Setup:</strong> {ex.setup}</p>
          <p><strong>Application:</strong> {ex.application}</p>
          <p><strong>Pitfall:</strong> {ex.pitfall}</p>
        </div>
      ))}
    </Section>
  )
}

function ExamView({ items }: { items: ExamQ[] }) {
  return (
    <Section title="Exam Questions">
      <ul className="space-y-3">
        {items.map((q, i) => (
          <li key={i}>
            <p className="font-medium">{q.type.toUpperCase()}: {q.prompt}</p>
            <ul className="list-disc list-inside text-sm">
              {q.expected_points.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function PlanView({ items }: { items: Spaced[] }) {
  return (
    <Section title="Study Plan">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="text-left"><th>Date</th><th>Focus</th><th>Minutes</th></tr>
        </thead>
        <tbody>
          {items.map((p, i) => (
            <tr key={i} className="border-t">
              <td>{p.date}</td>
              <td>{p.focus}</td>
              <td>{p.est_minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

/* ---------------- Interactive Views ---------------- */

function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [i, setI] = useState(0)
  const [reveal, setReveal] = useState(false)
  const c = cards[i]
  if (!c) return <p>No flashcards loaded.</p>

  return (
    <Section title="Flashcards">
      <p className="text-sm text-gray-500">Card {i + 1} / {cards.length}</p>
      <h3 className="mt-2 font-semibold">{c.question}</h3>
      {reveal && <p className="mt-2 text-gray-800">{c.answer}</p>}
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={() => setReveal(!reveal)}>
          {reveal ? "Hide" : "Reveal"}
        </button>
        <button className="btn" onClick={() => { setI(Math.max(0, i - 1)); setReveal(false) }}>
          Prev
        </button>
        <button className="btn" onClick={() => { setI(Math.min(cards.length - 1, i + 1)); setReveal(false) }}>
          Next
        </button>
      </div>
    </Section>
  )
}

function ClozeView({ cards }: { cards: Cloze[] }) {
  const [i, setI] = useState(0)
  const [reveal, setReveal] = useState(false)
  const c = cards[i]
  if (!c) return <p>No cloze cards loaded.</p>

  return (
    <Section title="Cloze Practice">
      <p className="text-sm text-gray-500">Item {i + 1} / {cards.length}</p>
      <p className="mt-2 text-gray-800">{c.text}</p>
      {reveal && <p className="mt-2 text-green-700">Answer: {c.answer}</p>}
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={() => setReveal(!reveal)}>
          {reveal ? "Hide" : "Reveal"}
        </button>
        <button className="btn" onClick={() => { setI(Math.max(0, i - 1)); setReveal(false) }}>
          Prev
        </button>
        <button className="btn" onClick={() => { setI(Math.min(cards.length - 1, i + 1)); setReveal(false) }}>
          Next
        </button>
      </div>
    </Section>
  )
}

function MCQView({ cards }: { cards: MCQ[] }) {
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const c = cards[i]
  if (!c) return <p>No MCQs loaded.</p>

  return (
    <Section title="Multiple Choice">
      <p className="text-sm text-gray-500">Q {i + 1} / {cards.length}</p>
      <p className="mt-2 font-medium">{c.question}</p>
      <div className="mt-2 space-y-2">
        {c.options.map((opt, j) => {
          const isCorrect = opt === c.answer
          const chosen = selected === opt
          return (
            <button
              key={j}
              className={`btn w-full justify-start ${chosen ? (isCorrect ? "bg-green-200" : "bg-red-200") : ""}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected && (
        <p className="mt-3 text-sm text-gray-700">
          {selected === c.answer ? "✅ Correct! " : "❌ Incorrect. "}
          {c.explanation}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={() => { setI(Math.max(0, i - 1)); setSelected(null) }}>
          Prev
        </button>
        <button className="btn" onClick={() => { setI(Math.min(cards.length - 1, i + 1)); setSelected(null) }}>
          Next
        </button>
      </div>
    </Section>
  )
}

function CaseView({ cases }: { cases: MiniCase[] }) {
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState("")
  const [show, setShow] = useState(false)
  const c = cases[i]
  if (!c) return <p>No cases loaded.</p>

  return (
    <Section title="Mini Case">
      <p className="text-sm text-gray-500">Case {i + 1} / {cases.length}</p>
      <p className="mt-2">{c.scenario}</p>
      <p className="mt-2 font-medium">{c.question}</p>
      <textarea
        className="textarea mt-3"
        placeholder="Type your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button className="btn mt-3" onClick={() => setShow(true)}>Submit</button>
      {show && (
        <div className="mt-4 bg-gray-50 border rounded-xl p-4">
          <h4 className="font-semibold">Suggested Solution:</h4>
          <ul className="list-disc list-inside">
            {c.solution_steps.map((s, j) => <li key={j}>{s}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={() => { setI(Math.max(0, i - 1)); setAnswer(""); setShow(false) }}>
          Prev
        </button>
        <button className="btn" onClick={() => { setI(Math.min(cases.length - 1, i + 1)); setAnswer(""); setShow(false) }}>
          Next
        </button>
      </div>
    </Section>
  )
}
