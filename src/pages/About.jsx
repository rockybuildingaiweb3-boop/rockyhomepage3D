import { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { CTA } from "../components";
import { experiences, skills, personalInfo } from "../constants";

import "react-vertical-timeline-component/style.min.css";

const About = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const skillCategories = ["All", "Frontend", "Backend", "Animation", "Database", "Version Control"];

  const filteredSkills = selectedCategory === "All"
    ? skills
    : skills.filter((s) => s.type === selectedCategory);

  return (
    <section className='max-container'>
      <h1 className='head-text'>
        Hello, I'm{" "}
        <span className='blue-gradient_text font-semibold drop-shadow'>
          {personalInfo.name}
        </span>{" "}
        👋
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-slate-600 leading-relaxed text-base sm:text-lg'>
        <p>{personalInfo.bio}</p>
        <p className='text-sm text-slate-500'>
          📍 Based in <strong className='text-slate-700'>{personalInfo.location}</strong> · Available for full-time roles & high-impact contracts.
        </p>
      </div>

      {/* Skills Section */}
      <div className='py-12 flex flex-col'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h3 className='subhead-text'>Technical Skills & Stack</h3>

          {/* Category Filter Tabs with underline/dot indicator instead of heavy colored pills */}
          <div className='flex flex-wrap items-center gap-4 sm:gap-6 border-b border-[#E7E7B7]/60 pb-1'>
            {skillCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative py-1 text-xs sm:text-sm font-medium transition-colors ${
                    isSelected
                      ? "text-[#C97851] font-semibold"
                      : "text-[#263746]/70 hover:text-[#263746]"
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && (
                    <span className='w-full h-0.5 rounded-full bg-[#C97851] absolute -bottom-1.5 left-0' />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className='mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 sm:gap-8'>
          {filteredSkills.map((skill) => (
            <div
              className='flex flex-col items-center group cursor-pointer'
              key={skill.name}
            >
              <div className='block-container w-16 h-16 sm:w-20 sm:h-20'>
                <div className='btn-back rounded-2xl' />
                <div className='btn-front rounded-2xl flex justify-center items-center p-3 bg-[#F5F5F0]/90 shadow-sm border border-[#E7E7B7]/70'>
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className='w-full h-full object-contain transition-transform group-hover:scale-110'
                  />
                </div>
              </div>
              <span className='mt-2 text-xs font-medium text-[#263746] text-center font-poppins group-hover:text-[#C97851] transition-colors'>
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className='py-12'>
        <h3 className='subhead-text'>Work Experience</h3>
        <div className='mt-4 flex flex-col gap-2 text-slate-600'>
          <p>
            Here is a timeline of the professional software engineering roles and projects I have delivered:
          </p>
        </div>

        <div className='mt-10 flex'>
          <VerticalTimeline>
            {experiences.map((experience) => (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className='flex justify-center items-center w-full h-full'>
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className='w-[60%] h-[60%] object-contain'
                    />
                  </div>
                }
                contentStyle={{
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  borderRadius: "16px",
                  background: "#ffffff",
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p
                    className='text-[#C97851] font-semibold text-base'
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className='text-slate-600 font-normal pl-1 text-sm leading-relaxed'
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <hr className='border-slate-200 my-8' />

      <CTA />
    </section>
  );
};

export default About;
