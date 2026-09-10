import Image from 'next/image'

export default function ProfilePage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
        <p className="mt-2 text-xs text-[#14204f]/75">Customize your learning portal experience, security, notifications, and language.</p>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:flex-row sm:items-center sm:px-6">
        <Image src="/avatar-placeholder.png" alt="Aster Seawalker" width={80} height={80} className="h-20 w-20 rounded-full object-cover" />
        <div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-[#1C1D52]">Aster Seawalker</h2><p className="mt-1 text-xs text-[#5FBB46]">Student · computer_science_bachelors_undergrad</p><p className="mt-1 text-[10px] text-slate-500">San Francisco, California</p></div>
        <button type="button" className="rounded-lg bg-[#1C1D52] px-4 py-2 text-[10px] font-semibold text-white">Edit Profile</button>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Personal Information</h2><dl className="mt-4 space-y-3 text-[10px]"><div><dt className="uppercase text-slate-400">Full Name</dt><dd className="mt-1 font-semibold text-[#1C1D52]">Aster Seawalker</dd></div><div><dt className="uppercase text-slate-400">Email Address</dt><dd className="mt-1 font-semibold text-[#1C1D52]">aster.seawalker@clarity.edu</dd></div><div><dt className="uppercase text-slate-400">Phone Number</dt><dd className="mt-1 font-semibold text-[#1C1D52]">+1 (555) 382-9901</dd></div><div><dt className="uppercase text-slate-400">Bio / About</dt><dd className="mt-1 max-w-lg leading-4 text-slate-600">Passionate Computer Science undergraduate with a core focus on reactive frontend patterns and robust API architectures. Love solving real-world product design challenges.</dd></div></dl></section>
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Education Details</h2><dl className="mt-4 space-y-3 text-[10px]"><div><dt className="uppercase text-slate-400">Institution</dt><dd className="mt-1 font-semibold text-[#1C1D52]">Clarity Institute of Technology</dd></div><div><dt className="uppercase text-slate-400">Program / Major</dt><dd className="mt-1 font-semibold text-[#1C1D52]">B.S. in Computer Science &amp; Engineering</dd></div><div><dt className="uppercase text-slate-400">Enrollment Date</dt><dd className="mt-1 font-semibold text-[#1C1D52]">September 2024</dd></div><div><dt className="uppercase text-slate-400">Student ID</dt><dd className="mt-1 font-semibold text-[#1C1D52]">CIT-90382–ASEA</dd></div></dl></section>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Learning Statistics</h2><div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4"><div className="py-2 text-center"><strong className="block text-xl text-[#1C1D52]">6</strong><span className="text-[9px] text-slate-500">Active Courses</span></div><div className="py-2 text-center"><strong className="block text-xl text-[#5FBB46]">2</strong><span className="text-[9px] text-slate-500">Completed Courses</span></div><div className="py-2 text-center"><strong className="block text-xl text-blue-500">4</strong><span className="text-[9px] text-slate-500">Certificates Earned</span></div><div className="py-2 text-center"><strong className="block text-xl text-[#1C1D52]">18h 45m</strong><span className="text-[9px] text-slate-500">Total Learning Hours</span></div></div></section>

      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Skills &amp; Interests</h2><div className="mt-3 flex flex-wrap gap-2">{['Full-Stack Development', 'UI/UX Architecture', 'React & TypeScript', 'Node.js API', 'Relational Databases', 'Figma', 'Problem Solving', 'Agile Methodologies'].map((skill) => <span key={skill} className="rounded-md bg-blue-100 px-3 py-1.5 text-[9px] font-medium text-[#1C1D52]">{skill}</span>)}</div></section>
    </div>
  )
}
