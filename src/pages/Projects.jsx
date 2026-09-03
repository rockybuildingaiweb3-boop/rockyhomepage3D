import { useState } from "react";
import { Link } from "react-router-dom";

import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className='max-container'>
      <h1 className='head-text'>
        Featured{" "}
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Projects
        </span>
      </h1>

      <p className='text-slate-600 mt-3 leading-relaxed text-base sm:text-lg'>
        A collection of full-stack, AI-powered, and interactive web applications I've engineered.
        Explore the source code, inspect architecture decisions, or try out live demonstrations.
      </p>

      {/* Filter / Search Bar */}
      <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='relative w-full sm:w-72'>
          <input
            type='text'
            placeholder='Search projects by name...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 bg-[#F5F5F0] border border-[#E7E7B7] text-[#263746] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E9A84A] shadow-sm'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B6A4E] hover:text-[#263746]'
            >
              ✕
            </button>
          )}
        </div>
        <p className='text-xs text-[#8B6A4E]'>
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-14'>
        {filteredProjects.map((project) => (
          <div
            className='bg-[#F5F5F0]/85 backdrop-blur-sm border border-[#E7E7B7] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group'
            key={project.name}
          >
            <div>
              <div className='block-container w-12 h-12 mb-5'>
                <div className={`btn-back rounded-xl ${project.theme}`} />
                <div className='btn-front rounded-xl flex justify-center items-center'>
                  <img
                    src={project.iconUrl}
                    alt={project.name}
                    className='w-1/2 h-1/2 object-contain'
                  />
                </div>
              </div>

              <h4 className='text-xl sm:text-2xl font-poppins font-semibold text-[#263746] group-hover:text-[#C97851] transition-colors'>
                {project.name}
              </h4>
              <p className='mt-2.5 text-[#263746]/75 text-sm sm:text-base leading-relaxed'>
                {project.description}
              </p>
            </div>

            <div className='mt-6 pt-4 border-t border-[#E7E7B7]/70 flex items-center justify-between'>
              <Link
                to={project.link}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 font-medium text-[#C97851] hover:text-[#E9A84A] text-sm group-hover:underline'
              >
                <span>View Project Code / Demo</span>
                <img
                  src={arrow}
                  alt='arrow'
                  className='w-3.5 h-3.5 object-contain transition-transform group-hover:translate-x-1'
                />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default Projects;
