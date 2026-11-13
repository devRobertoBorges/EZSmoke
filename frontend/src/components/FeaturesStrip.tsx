import { ShieldCheck, Smartphone, Target, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Rápido e prático",
    text: "Encontre a utilitária que precisa em segundos.",
  },
  {
    icon: Target,
    title: "Todas as utilitárias",
    text: "Smoke, flash, molotov e HE.",
  },
  {
    icon: ShieldCheck,
    title: "Com ou sem conta",
    text: "Consulte o conteúdo gratuito ou aproveite o Premium.",
  },
  {
    icon: Smartphone,
    title: "Em qualquer dispositivo",
    text: "No celular ou no computador, sempre com você.",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="features-section">
      <div className="container">
        <ul className="features">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="feature">
              <Icon className="feature__icon" size={28} aria-hidden="true" />
              <div>
                <h3 className="feature__title">{title}</h3>
                <p className="feature__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}