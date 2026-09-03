import emailjs from "@emailjs/browser";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";
import { personalInfo } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [copied, setCopied] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentAnimation("hit");

    const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      emailjs
        .send(
          serviceId,
          templateId,
          {
            from_name: form.name,
            to_name: personalInfo.name,
            from_email: form.email,
            to_email: personalInfo.email,
            message: form.message,
          },
          publicKey
        )
        .then(
          () => {
            setLoading(false);
            showAlert({
              show: true,
              text: "Thank you for your message! 😃",
              type: "success",
            });

            setTimeout(() => {
              hideAlert(false);
              setCurrentAnimation("idle");
              setForm({ name: "", email: "", message: "" });
            }, 3500);
          },
          (error) => {
            setLoading(false);
            console.error(error);
            setCurrentAnimation("idle");

            showAlert({
              show: true,
              text: "Failed to send through EmailJS. You can use direct mailto below!",
              type: "danger",
            });
          }
        );
    } else {
      // Graceful fallback when EmailJS keys are not configured
      setTimeout(() => {
        setLoading(false);
        showAlert({
          show: true,
          text: `Message recorded! (Or send via mailto to ${personalInfo.email}) 😃`,
          type: "success",
        });

        setTimeout(() => {
          hideAlert(false);
          setCurrentAnimation("idle");
          setForm({ name: "", email: "", message: "" });
        }, 3500);
      }, 1000);
    }
  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
      {alert.show && <Alert {...alert} />}

      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>Get in Touch</h1>
        <p className='text-slate-600 mt-2 text-base'>
          Have an exciting project, freelance opportunity, or just want to connect?
          Send me a note or reach out directly!
        </p>

        {/* Quick Contact Card */}
        <div className='mt-6 p-4 bg-[#F5F5F0]/90 backdrop-blur-md rounded-2xl border border-[#E7E7B7] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-[#8B6A4E]'>
              Direct Email
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className='text-sm font-semibold text-[#C97851] hover:text-[#E9A84A] hover:underline transition-colors'
            >
              {personalInfo.email}
            </a>
          </div>
          <button
            type='button'
            onClick={copyEmail}
            className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E7E7B7]/40 hover:bg-[#E7E7B7]/80 text-[#263746] transition-colors'
          >
            {copied ? "✓ Copied!" : "Copy Email"}
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='w-full flex flex-col gap-6 mt-8'
        >
          <label className='text-black-500 font-semibold text-sm'>
            Your Name
            <input
              type='text'
              name='name'
              className='input'
              placeholder='What should I call you?'
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-black-500 font-semibold text-sm'>
            Your Email
            <input
              type='email'
              name='email'
              className='input'
              placeholder='you@example.com'
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-black-500 font-semibold text-sm'>
            Your Message
            <textarea
              name='message'
              rows='4'
              className='textarea'
              placeholder='Tell me about your project, timeline, or idea...'
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <div className='flex flex-col sm:flex-row gap-3 items-center'>
            <button
              type='submit'
              disabled={loading}
              className='btn flex-1'
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            <a
              href={`mailto:${personalInfo.email}?subject=Inquiry from Portfolio&body=Hi ${personalInfo.name},`}
              className='w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#E7E7B7] text-[#263746] hover:bg-[#E7E7B7]/40 text-sm font-medium text-center transition-colors'
            >
              Open Email App
            </a>
          </div>
        </form>
      </div>

      {/* 3D Fox Canvas */}
      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px] flex items-center justify-center'>
        <Canvas
          dpr={[1, 2]}
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.629, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
