type InfoCard = {
  title: string
  description: string
}

const applicantHighlights: InfoCard[] = [
  {
    title: 'Venue Discovery',
    description:
      'Hirers can compare venue candidates by capacity, location, and suitability before applying.',
  },
  {
    title: 'Application Details',
    description:
      'Applicants provide event details including expected guests, date, time, and duration.',
  },
  {
    title: 'Hiring Reputation',
    description:
      'A clear history of previous hires and ratings helps vendors assess credibility quickly.',
  },
]

const venueHighlights: InfoCard[] = [
  {
    title: 'Applicant Suitability Review',
    description:
      'Vendors can review event requirements and applicant profiles in one place.',
  },
  {
    title: 'Historical Records',
    description:
      'Past hire data and compliance evidence help inform safer booking decisions.',
  },
  {
    title: 'Approval Workflow',
    description:
      'Select candidates, leave comments, and confirm bookings with a structured workflow.',
  },
]

function HomeOverview() {
  return (
    <main id="home" className="vv-main">
      <section id="about" className="vv-section">
        <h2>What this system supports</h2>
        <p>
          Venue Vendors (VV) is designed for event venue hiring interactions
          between two user groups: hirers and vendors. This prototype focuses on
          clear workflow visibility and user-friendly decision support.
        </p>
      </section>

      <section className="vv-grid" aria-label="Hirer and venue information">
        <article className="vv-panel">
          <h3>For Hirers</h3>
          <ul>
            {applicantHighlights.map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="vv-panel" id="vendor-tools">
          <h3>For Vendors</h3>
          <ul>
            {venueHighlights.map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="vv-cta-row" aria-label="Authentication quick links">
        <article id="sign-up" className="vv-cta">
          <h3>New user?</h3>
          <p>Use Sign Up to create an account before accessing the platform.</p>
          <button type="button">Go to Sign Up</button>
        </article>
        <article id="sign-in" className="vv-cta">
          <h3>Returning user?</h3>
          <p>Sign In to continue managing applicants, venues, and bookings.</p>
          <button type="button">Go to Sign In</button>
        </article>
      </section>
    </main>
  )
}

export default HomeOverview
