function FeedbackAlert({ feedback }) {
  if (!feedback.message) {
    return null
  }

  return (
    <div
      className={`mb-5 rounded-lg border p-3 text-sm ${feedback.type === 'danger' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {feedback.message}
    </div>
  )
}

export default FeedbackAlert
