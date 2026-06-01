import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import ModernNavbar from '../components/Home/ModernNavbar';
import SectionReveal from '../components/Effects/SectionReveal';
import Footer from '../components/Footer';

const Rulebook: React.FC = () => {
    const copyToClipboard = () => {
        const rawText = `ASCENT 2026 TOURNAMENT RULEBOOK & CODE OF CONDUCT
Official Regulations & Guidelines

------------------------------------------------------------------

1. General Provisions & Player Eligibility
• 1.1. Player Age Requirements: The tournament is open to players of all ages. Participants under the age of 20 must secure verifiable parent or legal guardian consent before registering.
• 1.2. Regional & Roster Limits: Teams must consist of five (5) primary roster players and may declare up to one (1) designated substitute player. All roster details must be submitted via the official registration form on the portal.
• 1.3. Account Standing: All players must use their own active Riot Games accounts in good competitive standing. Accounts with active bans, restrictions, or vanguard suspensions are automatically disqualified.

2. Roster Management & Deadlines
• 2.1. Roster Lock: Team rosters are locked exactly 14 days before the commencement of the online stage. No additions or edits to the roster or substitute slot can be made past this deadline.
• 2.2. Substitutions: A substitute player may only be brought into a match *between* maps. Mid-map substitutions are strictly prohibited unless explicit, manual authorization is granted by a Senior Tournament Admin due to severe technical or medical emergencies.
• 2.3. Emergency Roster Clause: If a team is unable to field five (5) validated players from their registered roster at the scheduled match time, they will immediately forfeit the match. Ringers (unregistered players) are strictly prohibited.

3. Match Rules & Tournament Format
• 3.1. Structure: The tournament utilizes a strict 16-team format optimized for production quality and competitive flow.
• 3.2. Game Version: All matches will be played on the latest live patch available on the designated competitive region servers, unless tournament administration dictates otherwise due to a game-breaking bug.
• 3.3. Map & Side Selection: Map vetoes and side selections will be conducted via the official tournament portal or Discord coordination channel 30 minutes prior to the scheduled match time, overseen by an assigned match referee.
• 3.4. Technical Pauses: Teams are permitted up to two (2) technical pauses per map for disconnected players or hardware failures, with a maximum duration of five (5) minutes per pause. The game must be unpaused only after both team captains confirm readiness in the in-game match chat. Intentionally abusing tactical or technical pauses to disrupt momentum will result in an immediate map forfeiture.

4. Competitive Integrity & Anti-Cheat
• 4.1. Anti-Cheat Software: Riot Games' Vanguard anti-cheat must be active and functional for all players. Any player triggering a hardware or software ban mid-match will cause their entire team to be instantly disqualified from ASCENT 2026, forfeiting all prizing.
• 4.2. Exploits & Glitches: The intentional use of game-breaking bugs, map geometry exploits, pixel-walking, or unapproved utility placements is strictly prohibited. If an exploit occurs, the opposing team must immediately clip the event and notify their match referee. Penalties range from round loss to complete series forfeiture at admin discretion.
• 4.3. Match-Fixing & Collusion: Any form of match-fixing, intentional throwing, bracket manipulation, or collusion between teams will result in a permanent lifetime ban from all current and future Student Ventures Group events.

5. Code of Conduct & Behavior
• 5.1. Professionalism & Sportsmanship: Players must conduct themselves with respect and professionalism at all times. This applies to public in-game chat, official Discord channels, livestreams, and the physical venue.
• 5.2. Toxicity & Harassment: Zero tolerance is enforced for hate speech, racial or sexual slurs, targeted harassment, and extreme toxic behavior. First offenses will result in a formal warning and round deduction. Repeat offenses will trigger immediate team disqualification.
• 5.3. Public Demeanor: Players are ambassadors of the student gaming community. Defamatory statements or public behavior that brings unnecessary disrepute to the tournament, production staff, or event partners will face severe operational penalties.

6. Live Finals Infrastructure (Lumina Ballroom, Cinnamon Life)
• 6.1. Physical Attendance: The final qualified teams must be physically present at the Lumina Ballroom, Cinnamon Life, for the live championship matches.
• 6.2. Provided Hardware: Tournament organizers will provide uniform PCs and monitors for the stage matches. Players are required to bring their own primary peripherals (mice, keyboards, audio headsets and mousepads) and must submit them to the technical crew for security verification 1 hour before their match.
• 6.3. Media Commitments: Finalist teams are contractually obligated to participate in pre-match interviews, stage photography, broadcast segments, and post-match media press activities as directed by the production crew.

7. Administrative Authority
• 7.1. Finality of Decisions: Tournament administrators and senior referees reserve the right to rule on any scenario not explicitly outlined in this rulebook to preserve fair play. All administrative decisions made on-site or during live match operations are final, absolute, and non-appealable.

------------------------------------------------------------------
Copyright © ASCENT 2026. All Rights Reserved.`;

        navigator.clipboard.writeText(rawText).then(() => {
            alert('Rulebook copied to clipboard! Ready to paste into Google Docs.');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-slate-200 font-inter selection:bg-[#ff4655] selection:text-white">
            <ModernNavbar />

            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                 style={{ background: `
                    radial-gradient(ellipse 80% 50% at 15% 10%, rgba(100,200,255,0.12) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 40% at 85% 85%, rgba(255,70,85,0.10) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 50% at 50% 0%, rgba(100,200,255,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse 70% 50% at 20% 100%, rgba(100,200,255,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 60% at 80% 10%, rgba(255,70,85,0.06) 0%, transparent 50%),
                    linear-gradient(180deg, #040814 0%, #08080f 100%)
                 `}}
            >
                <div className="absolute inset-0 bg-grid opacity-5" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/register" className="inline-flex items-center gap-2 text-[#ff4655] font-mono text-xs tracking-widest hover:gap-3 transition-all mb-12 group">
                        <ArrowLeft size={14} />
                        BACK TO REGISTRATION
                    </Link>

                    <SectionReveal>
                        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                            <div>
                                <div className="text-xs uppercase tracking-widest text-[#ff4655] font-bold mb-2 font-mono">Competitive Operations Branch</div>
                                <h1 className="font-teko text-6xl md:text-8xl font-bold leading-none mb-2 uppercase">Official Rulebook</h1>
                                <div className="h-1 w-24 bg-[#ff4655]" />
                            </div>
                            
                            <div className="flex gap-4 w-full md:w-auto">
                                <button 
                                    onClick={copyToClipboard}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#ff4655]/10 hover:bg-[#ff4655]/20 border border-[#ff4655]/30 text-[#ff4655] font-teko text-xl tracking-widest uppercase transition-all rounded"
                                >
                                    <Copy size={18} />
                                    Copy Text
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-teko text-xl tracking-widest uppercase transition-all rounded"
                                >
                                    <Printer size={18} />
                                    Print
                                </button>
                            </div>
                        </header>

                        <div className="space-y-12 text-lg leading-relaxed print:text-black print:bg-white print:p-8">
                            <section>
                                <p className="mb-4">
                                    Welcome to the official Tournament Rulebook for the <strong>ASCENT 2026</strong>. All participating teams, team managers, and registered competitors are contractually obligated to read, understand, and strictly follow the clauses set forth in this document. 
                                </p>
                                <p>
                                    By proceeding with match execution, roster check-ins, or player registrations, you explicitly agree to these rules and the final, binding authority of the ASCENT Tournament Administration Committee.
                                </p>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">1.</span> General Provisions & Player Eligibility
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">1.1. Player Age Requirements:</strong> The tournament is open to players of all ages. Participants under the age of 20 must secure verifiable parent or legal guardian consent before registering.</li>
                                    <li><strong className="text-white">1.2. Regional & Roster Limits:</strong> Teams must consist of five (5) primary roster players and may declare up to one (1) designated substitute player. All roster details must be submitted via the official registration form on the portal.</li>
                                    <li><strong className="text-white">1.3. Account Standing:</strong> All players must use their own active Riot Games accounts in good competitive standing. Accounts with active bans, restrictions, or vanguard suspensions are automatically disqualified.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">2.</span> Roster Management & Deadlines
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">2.1. Roster Lock:</strong> Team rosters are locked exactly 14 days before the commencement of the online stage. No additions or edits to the roster or substitute slot can be made past this deadline.</li>
                                    <li><strong className="text-white">2.2. Substitutions:</strong> A substitute player may only be brought into a match *between* maps. Mid-map substitutions are strictly prohibited unless explicit, manual authorization is granted by a Senior Tournament Admin due to severe technical or medical emergencies.</li>
                                    <li><strong className="text-white">2.3. Emergency Roster Clause:</strong> If a team is unable to field five (5) validated players from their registered roster at the scheduled match time, they will immediately forfeit the match. Ringers (unregistered players) are strictly prohibited.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">3.</span> Match Rules & Tournament Format
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">3.1. Structure:</strong> The tournament utilizes a strict 16-team format optimized for production quality and competitive flow.</li>
                                    <li><strong className="text-white">3.2. Game Version:</strong> All matches will be played on the latest live patch available on the designated competitive region servers, unless tournament administration dictates otherwise due to a game-breaking bug.</li>
                                    <li><strong className="text-white">3.3. Technical Pauses:</strong> Teams are permitted up to two (2) technical pauses per map for disconnected players or hardware failures, with a maximum duration of five (5) minutes per pause. The game must be unpaused only after both team captains confirm readiness in the in-game match chat. Intentionally abusing tactical or technical pauses to disrupt momentum will result in an immediate map forfeiture.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">4.</span> Competitive Integrity & Anti-Cheat
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">4.1. Anti-Cheat Software:</strong> Riot Games' Vanguard anti-cheat must be active and functional for all players. Any player triggering a hardware or software ban mid-match will cause their entire team to be instantly disqualified from ASCENT 2026, forfeiting all prizing.</li>
                                    <li><strong className="text-white">4.2. Exploits & Glitches:</strong> The intentional use of game-breaking bugs, map geometry exploits, pixel-walking, or unapproved utility placements is strictly prohibited. If an exploit occurs, the opposing team must immediately clip the event and notify their match referee. Penalties range from round loss to complete series forfeiture at admin discretion.</li>
                                    <li><strong className="text-white">4.3. Match-Fixing & Collusion:</strong> Any form of match-fixing, intentional throwing, bracket manipulation, or collusion between teams will result in a permanent lifetime ban from all current and future Student Ventures Group events.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">5.</span> Code of Conduct & Behavior
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">5.1. Professionalism & Sportsmanship:</strong> Players must conduct themselves with respect and professionalism at all times. This applies to public in-game chat, official Discord channels, livestreams, and the physical venue.</li>
                                    <li><strong className="text-white">5.2. Toxicity & Harassment:</strong> Zero tolerance is enforced for hate speech, racial or sexual slurs, targeted harassment, and extreme toxic behavior. First offenses will result in a formal warning and round deduction. Repeat offenses will trigger immediate team disqualification.</li>
                                    <li><strong className="text-white">5.3. Public Demeanor:</strong> Players are ambassadors of the student gaming community. Defamatory statements or public behavior that brings unnecessary disrepute to the tournament, production staff, or event partners will face severe operational penalties.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">6.</span> Live Finals Infrastructure (Lumina Ballroom)
                                </h2>
                                <ul className="list-none space-y-4 text-slate-300 text-base md:text-lg">
                                    <li><strong className="text-white">6.1. Physical Attendance:</strong> The final qualified teams must be physically present at the Lumina Ballroom, Cinnamon Life, for the live championship matches.</li>
                                    <li><strong className="text-white">6.2. Provided Hardware:</strong> Tournament organizers will provide uniform PCs and monitors for the stage matches. Players are required to bring their own primary peripherals (mice, keyboards, audio headsets and mousepads) and must submit them to the technical crew for security verification 1 hour before their match.</li>
                                    <li><strong className="text-white">6.3. Media Commitments:</strong> Finalist teams are contractually obligated to participate in pre-match interviews, stage photography, broadcast segments, and post-match media press activities as directed by the production crew.</li>
                                </ul>
                            </section>

                            <section className="border-l-2 border-[#ff4655]/40 pl-6">
                                <h2 className="font-teko text-3xl text-white mb-4 uppercase tracking-wider flex items-center gap-3">
                                    <span className="text-[#ff4655]">7.</span> Administrative Authority
                                </h2>
                                <p className="text-slate-300 text-base md:text-lg">
                                    Tournament administrators and senior referees reserve the right to rule on any scenario not explicitly outlined in this rulebook to preserve fair play. All administrative decisions made on-site or during live match operations are final, absolute, and non-appealable.
                                </p>
                            </section>

                        </div>
                    </SectionReveal>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Rulebook;
