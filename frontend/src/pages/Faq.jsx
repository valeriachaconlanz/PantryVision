import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import useAppState from '../hooks/useAppState.js'
import './Faq.css'

const QUESTIONS = [
  {
    q: 'What happens to my pantry photos?',
    a: (
      <>
        <p>
          Before anything gets uploaded, we shrink your photos on your phone. Then we send them to Google's Gemini AI,
          which looks at them and tells us what ingredients it sees. That list is what we use to find your recipes.
        </p>
        <p>
          Once a photo is sent to Gemini, Google handles it under its own terms, and it may keep photos it gets. So we
          don't control what happens to it after that. Google's terms are at{' '}
          <a className="link" href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">
            ai.google.dev/gemini-api/terms
          </a>
          .
        </p>
      </>
    ),
  },
  {
    q: 'Can I use PantryVision without taking photos?',
    a: (
      <p>
        Yep. On the search page you can switch to "Type it" or "Say it" and just list what you have. You get the same
        recipes and no photo leaves your phone.
      </p>
    ),
  },
  {
    q: 'Any tips for taking pantry photos?',
    a: (
      <p>
        Good light and a straight-on shot of each shelf work best. Try to keep stuff like mail, faces, or anything with
        your address out of the frame, since the whole photo gets sent.
      </p>
    ),
  },
  {
    q: 'Where is my photo history saved?',
    a: (
      <p>
        Only on the device you're using, in your browser. You can clear it any time from your profile. Clearing it
        removes it from your phone, but it doesn't undo photos that were already sent to Gemini.
      </p>
    ),
  },
  {
    q: 'What do you do with my diet and allergy info?',
    a: (
      <p>
        We use it to filter out recipes that don't fit you, like anything with peanuts if you're allergic. You can change
        it whenever you want in your profile.
      </p>
    ),
  },
  {
    q: 'Where do the recipes come from?',
    a: (
      <p>
        We find them through Spoonacular, a big recipe database. Every recipe shows who originally made it and links back
        to the original page. Spoonacular only gets your ingredient list and filters, never your photos.
      </p>
    ),
  },
  {
    q: 'Is voice input recorded?',
    a: (
      <p>
        We don't record anything. Voice input uses your browser's built in speech to text, so depending on your browser
        the audio might be processed by the company that makes it (like Google for Chrome or Apple for Safari).
      </p>
    ),
  },
  {
    q: 'How do I delete my account?',
    a: (
      <p>
        Go to your profile and hit "Delete my account" at the bottom. That wipes your saved recipes, ratings, and diet
        info.
      </p>
    ),
  },
  {
    q: 'Does it cost anything?',
    a: <p>Nope, it's free. PantryVision is a class project made by Team 7.</p>,
  },
]

export default function Faq() {
  const { user } = useAppState()

  return (
    <>
      <Header variant="home" />
      <main className="wrap narrow faq">
        <h1>
          Questions? <span className="outline">Answers.</span>
        </h1>
        <p className="lede">The stuff people usually ask us, especially about photos and privacy.</p>

        <div className="faq-list">
          {QUESTIONS.map(({ q, a }, i) => (
            <details key={q} className="faq-item" open={i === 0}>
              <summary>{q}</summary>
              <div className="faq-answer">{a}</div>
            </details>
          ))}
        </div>

        <div className="faq-end panel">
          <h2>Still curious?</h2>
          <p>The full privacy note is at the bottom of the home page. Or skip the reading and start cooking.</p>
          <div className="row">
            <Link className="btn" to="/">
              Back home
            </Link>
            <Link className="btn red" to={user ? '/search' : '/signup'}>
              {user ? 'Find a recipe' : 'Make an account'}
            </Link>
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <div className="wrap" style={{ paddingTop: 22 }}>
          <span>PantryVision, est. 2026</span>
          <span>Made by Team 7</span>
        </div>
      </footer>
    </>
  )
}
