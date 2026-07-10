import React, { useState } from 'react';
import { X, Briefcase, UserPlus, Calendar, DollarSign, FileText, CheckCircle2, Upload, Video, Download } from 'lucide-react';

/**
 * RecruitmentDrawers.jsx
 * Precision Enterprise modal dialogs and viewers for EWMP Recruitment Management.
 */

export const CreateJobModal = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [hiringManagerId, setHiringManagerId] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('FULL_TIME');
  const [salary, setSalary] = useState('');
  const [openings, setOpenings] = useState(1);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a Job Position title.');
    if (!departmentId.trim() || !hiringManagerId.trim()) return alert('Please enter database IDs for department and hiring manager.');

    onConfirm && onConfirm({
      title,
      departmentId,
      hiringManagerId,
      location,
      type,
      salary,
      openings: Number(openings) || 1,
      description,
      requirements
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">CREATE NEW JOB REQUISITION</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Position Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Systems Engineer (Distributed Caching)"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Department ID</label>
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                placeholder="MongoDB department id"
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Hiring Manager ID</label>
              <input
                type="text"
                value={hiringManagerId}
                onChange={(e) => setHiringManagerId(e.target.value)}
                placeholder="MongoDB employee id"
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Work Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target Openings</label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Salary & Compensation Band</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $130k-$160k + Equity + Executive Benefits"
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Employment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
            >
              <option value="FULL_TIME">Full-Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
              <option value="INTERN">Internship</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Job Description & Responsibilities</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline key day-to-day responsibilities, architectural scope, and team mentorship goals..."
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
            />
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Mandatory Technical Requirements & Skills</label>
            <textarea
              rows="2"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. 5+ years Node.js, Redis, Distributed Systems, Docker, Kubernetes..."
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} /> Publish Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddCandidateModal = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appliedRole, setAppliedRole] = useState('');
  const [experience, setExperience] = useState('0');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return alert('Please enter candidate Name and Email.');

    onConfirm && onConfirm({
      name,
      email,
      phone,
      appliedRole,
      experience: Number(experience) || 1,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">ADD NEW CANDIDATE PROFILE</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Candidate Full Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Turner"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Email Address <span className="text-rose-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.turner@dev.io"
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Applied Job Requisition</label>
              <input
                type="text"
                value={appliedRole}
                onChange={(e) => setAppliedRole(e.target.value)}
                placeholder="Job/designation id or title from database"
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Exp (Years)</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              />
            </div>
          </div>

          {/* Resume Upload Box */}
          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Resume / CV Document</label>
            <div
              onClick={() => alert('Resume upload is handled by the recruitment API when file upload is enabled.')}
              className="p-4 bg-[#faf8ff] dark:bg-[#161616] border-2 border-dashed border-[#c3c6d7] dark:border-gray-800 rounded-lg text-center cursor-pointer hover:border-[#2563eb] transition-colors"
            >
              <Upload size={20} className="text-[#2563eb] mx-auto mb-1" />
              <span className="font-bold block text-[#191b23] dark:text-white">Click to Upload Resume PDF or Word CV</span>
              <span className="text-[10px] font-mono text-[#737686]">Supports AI auto-parsing for skills and work history</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">HR Screening Notes & Referral Source</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus size={15} /> Add Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ScheduleInterviewModal = ({ isOpen, onClose, onConfirm, candidateName = '' }) => {
  const [candidate, setCandidate] = useState(candidateName);
  const [candidateId, setCandidateId] = useState('');
  const [round, setRound] = useState('Technical');
  const [interviewerId, setInterviewerId] = useState('');
  const [mode, setMode] = useState('Video Call');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetLink, setMeetLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateId.trim() && !candidate.trim()) return alert('Please enter a candidate.');
    if (!interviewerId.trim()) return alert('Please enter a real interviewer employee ID.');
    if (!date || !time) return alert('Please enter interview date and time.');
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    onConfirm && onConfirm({
      candidateId,
      candidateName: candidate,
      round,
      interviewerId,
      mode,
      date,
      time,
      meetLink,
      meetingLink: meetLink,
      scheduledAt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#2563eb]" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">SCHEDULE INTERVIEW ROUND</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Candidate Name</label>
              <input
                type="text"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Candidate ID</label>
              <input
                type="text"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="MongoDB candidate id"
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Interview Stage / Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-bold"
              >
                <option value="Screening">Screening</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Assigned Interviewer / Panel Lead</label>
            <input
              type="text"
              value={interviewerId}
              onChange={(e) => setInterviewerId(e.target.value)}
              placeholder="MongoDB employee id"
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold"
              >
                <option value="Video Call">Video Call</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Time Window</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Video Meeting Link / Room URL</label>
            <input
              type="text"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full p-2.5 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono text-[#2563eb]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar size={15} /> Confirm & Dispatch Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const GenerateOfferModal = ({ isOpen, onClose, onConfirm, candidateName = '' }) => {
  const [candidate, setCandidate] = useState(candidateName);
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [bonus, setBonus] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm && onConfirm({
      candidateName: candidate,
      role,
      salary,
      bonus,
      joiningDate,
      status: 'PENDING'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-5 bg-[#ededf9] dark:bg-gray-900 border-b border-[#e1e2ed] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" />
            <h3 className="font-bold text-sm text-[#191b23] dark:text-white">GENERATE FORMAL EMPLOYMENT OFFER</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#737686] hover:text-[#191b23] dark:hover:text-white rounded">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Candidate Name</label>
              <input
                type="text"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Designated Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Base Salary Package</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold text-[#2563eb]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#191b23] dark:text-white mb-1">Target Bonus & Equity Grant</label>
            <input
              type="text"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="w-full p-2 bg-[#faf8ff] dark:bg-[#161616] border border-[#c3c6d7] dark:border-gray-800 rounded font-mono font-bold text-emerald-600"
            />
          </div>

          <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-900 text-[#434655] dark:text-gray-300">
            Offer governance rules will use the candidate, role, and compensation records stored in the database.
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e1e2ed] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ededf9] hover:bg-[#e1e2ed] dark:bg-gray-800 text-[#191b23] dark:text-white font-semibold rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
            >
              <DollarSign size={15} /> Generate Offer Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ResumeViewerModal = ({ isOpen, onClose, candidateName = 'Alex Turner', fileName = 'Alex_Turner_CV_2026.pdf' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] dark:bg-[#111111] border border-[#e1e2ed] dark:border-gray-800 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 bg-[#191b23] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#2563eb]" />
            <span className="font-bold text-sm">{candidateName} • CV Preview ({fileName})</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => alert('Downloading original resume PDF...')} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold flex items-center gap-1 transition-colors">
              <Download size={13} /> Download
            </button>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 font-mono text-xs bg-gray-50 dark:bg-[#161616] flex-1 text-[#191b23] dark:text-gray-200">
          <div className="border-b border-gray-300 dark:border-gray-800 pb-4 text-center">
            <h2 className="text-xl font-bold font-sans">{candidateName.toUpperCase()}</h2>
            <p className="text-gray-500">San Francisco, CA • alex.turner@dev.io • +1 (555) 019-2834 • github.com/aturner</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-[#2563eb] uppercase tracking-wider font-sans text-sm border-b border-gray-200 dark:border-gray-800 pb-1">Executive Summary & Skills</h3>
            <p className="leading-relaxed font-sans">
              Senior Software Engineer with 6+ years of experience specializing in high-throughput distributed systems, OAuth 2.0 authentication engines, and cloud-native Kubernetes architectures. Proven track record of reducing API latency and leading cross-functional migration squads.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Node.js', 'React 19', 'PostgreSQL', 'Redis Caching', 'Docker / Kubernetes', 'AWS Solutions Architect', 'OpenTelemetry', 'System Architecture'].map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563eb] dark:text-blue-300 rounded font-bold text-[11px]">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <h3 className="font-bold text-[#2563eb] uppercase tracking-wider text-sm border-b border-gray-200 dark:border-gray-800 pb-1">Professional Work Experience</h3>
            
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span>Lead Backend Engineer — CloudScale Solutions</span>
                <span className="font-mono text-gray-500">2023 – Present</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Architected multi-tenant SSO engine supporting over 450 enterprise workspaces with zero unplanned downtime.</li>
                <li>Mentored 4 junior engineers and implemented automated CI/CD performance testing pipelines.</li>
                <li>Optimized database indexing and Redis query caching to cut 99th percentile response latency by 28%.</li>
              </ul>
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between font-bold">
                <span>Software Engineer — DataPulse Analytics</span>
                <span className="font-mono text-gray-500">2020 – 2023</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Developed high-speed real-time data ingestion pipelines using Apache Kafka and Node.js microservices.</li>
                <li>Collaborated with UX product teams to deliver executive reporting dashboards in React.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 font-sans">
            <h3 className="font-bold text-[#2563eb] uppercase tracking-wider text-sm border-b border-gray-200 dark:border-gray-800 pb-1">Education & Certifications</h3>
            <div className="flex justify-between font-bold">
              <span>B.S. in Computer Science — University of California, Berkeley</span>
              <span className="font-mono text-gray-500">2016 – 2020</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">AWS Certified Solutions Architect Professional (Valid through 2027)</p>
          </div>
        </div>

        <div className="p-3 bg-[#ededf9] dark:bg-gray-900 border-t border-[#e1e2ed] dark:border-gray-800 flex justify-between items-center text-xs shrink-0">
          <span className="text-[#737686] font-mono">AI Auto-Parse Confidence: <strong className="text-emerald-600">96.4% Match</strong></span>
          <button onClick={onClose} className="px-4 py-1.5 bg-[#191b23] hover:bg-black text-white dark:bg-gray-800 rounded font-semibold transition-colors">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
