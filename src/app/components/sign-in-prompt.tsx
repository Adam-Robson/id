import "@/app/components/sign-in-prompt.css";

export default function SignInPrompt() {
  return (
    <div className="sign-in-prompt">
      <div className="sign-in-prompt-inner">
        <p className="sign-in-prompt-text">Sign in to stream the catalog</p>
        <div className="sign-in-prompt-links">
          <a href="/sign-up">Create account</a>
          <a href="/sign-in">Sign in</a>
        </div>
      </div>
    </div>
  );
}
