const foundations = [
  "Currículo e competências",
  "Tutor socrático com fontes aprovadas",
  "Evidências de aprendizagem",
];

export default function Home() {
  return (
    <main>
      <p className="eyebrow">Release 0 · Foundation</p>
      <h1>TutorIA Fisio</h1>
      <p className="lead">Uma base segura para aprender Fisioterapia com orientação personalizada.</p>
      <ul>{foundations.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className="status">Bootstrap técnico operacional</p>
    </main>
  );
}
