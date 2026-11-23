# Viva and interview questions

**1. What does the project do?**
Citizens report local problems. Admins verify them and assign a university. The university proposes and builds a
solution, industry supports it, and every step is recorded until the citizen rates the result.

**2. Why React and Spring Boot?**
React suits many interactive screens that share components. Spring Boot gives security, validation and
transactions, which a workflow with four roles needs.

**3. Why MySQL rather than MongoDB?**
The data is relational (users, problems, proposals, pledges) and rules such as "one proposal per assignment" are
enforced by database constraints and transactions.

**4. Where is the session kept, and why not in localStorage?**
In an HttpOnly cookie holding a signed JWT. Scripts cannot read it, so an injected script cannot steal it.

**5. Then why do you need CSRF protection?**
Browsers send cookies automatically, so another site could trigger a request. Changes also need a token header
that another site cannot read. SameSite=Strict is a second barrier.

**6. If JWTs are stateless, how does sign-out work?**
Each user has a session version that is also in the token. Signing out raises it, so older tokens are refused. The
user is loaded on every request anyway, so a changed role or a blocked account takes effect at once. The cost is that
signing out ends that user's sessions on every device.

**7. How are passwords stored?**
BCrypt with cost 12. A wrong email still runs one hash, so response time does not reveal which emails exist. Five
failures lock that email and address for 15 minutes.

**8. Is hiding a button enough to protect an action?**
No. The frontend only improves the experience; the API checks role, ownership and status on every request.

**9. What if two admins decide at the same moment?**
The problem row is locked first, so the second waits, sees the new status and is refused. Testing on MySQL found a
deadlock here that the in-memory database never showed.

**10. How do you stop funding above the budget?**
Acceptance happens under the same row lock: accepted funding plus the new offer is compared with the budget.

**11. How do you check an uploaded photo?**
Size and pixel limits, then it is decoded and saved again as JPEG. Files that are not pictures fail, and hidden
GPS data is removed.

**12. How is privacy protected?**
Unverified reports are visible only to their author and admins. The public map shows verified reports without names
and with locations rounded to about 1 km on the server.

**13. What is Flyway for?**
Every database change is a numbered script, so each computer gets the same schema and upgrades keep the data.

**14. How did you test it?**
Automated frontend and backend tests, the backend ones on both H2 and MySQL, plus the full flow in a real browser.

**15. How does the duplicate warning work?**
An indexed search in a box around the pin, then the exact distance (500 m) and same category. It only warns, because a
person should decide.

**16. How did you make the first load faster?**
Each page is its own file, downloaded when opened, so visitors do not download the dashboards or the map code.

**17. What is the Content-Security-Policy for?**
The browser runs only scripts from our own site, so injected script is blocked even if a bug lets it in.

**18. Limits, and what would you do next?**
- Registration emails are not verified, and there is no password reset: both need an email service.
- The login limit is in memory, so it suits one server; several would share it in Redis.
- The problem list is not split into pages on the server; that is needed for thousands of reports.
- Registration and the public endpoint have no rate limit.
- Any signed-in user sees the reporter's name on verified reports.
- Duplicates are found by place and category, not by wording.
- District checks use distance, not official boundaries.

**19. What was the hardest bug?**
The deadlock in question 9. The lesson: test on the database you will really use.

**20. Did you use AI tools?**
Answer truthfully, following your college's rules. Be ready to open any file and explain it.
