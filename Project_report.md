
Abstract
Maintaining cooperation when group interests are at odds with individual ones constitutes a major challenge. However, previous research has shown that reputation effects may constitute an important means to combat cooperation problems. According to the framework of indirect reciprocity, actors are more likely to cooperate with partners who have shown cooperative behavior in the past. Thus, cooperative individuals, are more likely to receive cooperative acts than uncooperative ones, keeping overall cooperation constant and high. Our experiment builds upon Milinksi et al’s (2002) work, which amongst others, showed the benefits of implementing reputation to solve public dilemmas. However, we focused on comparing against a control group, where building a reputation was not possible at all. In our experiment both groups played alternately one round of a public good game followed by an indirect reciprocity game. 

Introduction & Theoretical Background
The tragedy of the commons is a dilemma described in an influential article titled “the tragedy of the commons” written by ecologist Garret Hardin and published in 1968 (Hardin 1968). The Dilemma is caused by actors, who share a common good but act rationally according to each self interest. Thus, they behave contrary to the best interests of the whole community which leads to depletion of the good. Nevertheless, in everyday life, persistent cooperation amongst humans seems to be a common phenomenon. 
Social Dilemmas predominantly have been studied via public good games (Sylwester & Roberts 2013). Typically, cooperation declines after a few rounds of playing public good games (Fehr & Fischbacher 2003). Nevertheless, it showed that some game features can foster cooperation and even maintain it (Sell & Reese 2014). 
Amongst other factors, research on reputation in social dilemmas has shown, that it can improve the likelihood of cooperation and thus preventing recources from depletion (Milinski et al. 2002). In their experiment the authors used two game sequences, where the first sequence consisted of 16 rounds of a public good game alternated with an indirect reciprocity game. In the second sequence, participants played eight consecutive rounds of public goods games, followed by eight rounds of indirect reciprocity. In the first sequence the levels of cooperation remained high throughout the 16 alternating rounds, while during the second sequence, cooperation declined over the course of the eight repeated public goods game rounds and was restored over the course of the indirect reciprocity games. Subsequent studies pointed in the same direction, by supporting Milinski et al.’s (2002) findings in showing, that participants will cooperate more often, when an incentive to gain reputation exists (Milinski et al. 2006, Seemmann et al. 2005). 

Research Design
We therefore, build upon Milinski et al’s (2002) work, however we focus on the reputational effect and try to isolate it. Therefore, contrary to Milinski et al. (2002) we do not change the sequence of the experiment as a treatment. We focus on the effect of the reputation by introducing a control group where the players do not know the history of other player's decision. We expect that this group will be more likely to run into a tragedy than the other group, where the individuals are interested in maintaining their individual reputation. To implement our research design in our online experimental environment, we first of all divide participants into two groups. The treatment group gets to see the history of their respective partners in the game, while the control group does not and they get informed by their respective instructions about whether their decisions will be visible for others or not. Subsequently, both groups play alternately one round of a public goods game (PGG) followed by a round of an indirect reciprocity game (IRG). However, contrary to common PGG we implemented a resource pool, from which each individual draws from. That is, in the first part, players have to decide whether they want to cooperate or not, by deciding to draw a lower (cooperate) or higher (not cooperate) quantity of the resource, which is then saved in their private account. In the second part, players get randomly assigned a partner, and get asked if they want to donate a certain amount of their private account to their respective partner. At this point in time, the treatment group will be able to see past decisions of their assigned partners, while the control group does not. In the next round, the resource pool gets refilled by a certain quantity, such that if all of a group cooperated, the pool remains at the same level and does not go extinct. However, consequently if not all members cooperate, the pool shrinks overtime and allows groups to go bankrupt. That is, if a group depleted their resource, they are no longer able to draw from it, and only can switch tokens between themselves.


3. High-level description of your software implementation.
- Was wir genutzt haben: widgets, stages, entscheidungen mit buttons, verrechnung, Pool vs private earnings
3.1 What problems did you encounter and how did you solve them?
- SumPool und Loops: Stefanos Lösung; Extinction Pool Lösung: if Bedingungen und loops (mehrere Loops)

In the indirect reciprocity game, we encountered an error that only occurred seemingly randomly during our tests: The decision about the donation was sometimes displayed to the wrong player, and the coins were also taken away from the wrong players account. We found out that the IDs of the players we had used to send out the decision back to the correct player were stored in an array which remained fixed during the experiment. The decisions however, were saved in the order they arrived, which was sometimes equivalent to the order of the players, (when the player who logged in first, first clicked a button) and sometimes not. We solved this problem by not using the IDs from the game’s history. Instead, we used the players’ IDs that were being sent together with the incoming offers. These IDs were then used to correctly specify the receiver (the player who had made the decision himself). Generally, it was challenging and error-prone to deal with the decisions in the indirect reciprocity game, because the same decision of a certain player had to be processed in two different ways. The decision had to be returned to the player himself and forwarded to the exchange partner after being manipulated.
Last but not least, having different treatments beared a challenge for the indirect reciprocity game: Some contents had to be displayed only for one of the two treatment groups. We decided to move the statements from the htm-files to the player-client to be able to trigger them with an event listener in case they were needed (see chapter “Lessons learnt”). 


-  IR-Game: Differing code for own decision and other player’s decision
-  Treatments und unterschiedliche HTML-Elemente

-  Allg. Kommunikation Server und Player Ebene
3.2 Are there some open problems in your implementation that you were
not able to code? Say what and why you could not code them.

The biggest problem we were not able to solve is related to our treatment. As explained above, we were planning on displaying the history of all previous decisions of the “partner” in the common pool game stage to the players of the treatment group. It would have been necessary to generate a sort of table containing the decisions of the other player in the first step of the reciprocity game. This table would have been updated with every round, with only one decision displayed in the first round, and six in the last round. We were not able to code this, because we did not know how to access an array of all decisions of a player in the previous rounds. In the code elements we used as the starting point for our code, there were only functions that stored the players’ decision of the current round in the memory, in the next repetition of the respective game, this variable was being overwritten by the code. Hence, it would have been necessary to store the decisions not only player-, but round-specific. We had no idea how to code this, which is why we decided to circumvent this by changing the experimental design such that only the most recent decision of the other player is displayed now. For a critical discussion of this simplifying decision, see the conclusions.

4. Results (optional). Describe early findings.
5. Conclusions
5.1 How can your implementation be extended to test future/related problems.
-  ??
5.2 Honestly assess the reliability, robustness, and validity of your
implementation  (very important!)
-	Critique: Treatment simplified: no reputation, but punishment
-	Validity: Mixed motivations to cooperate: Reputation/punishment not isolated, motivation to keep the pool alive (disadvantage of being close to reality: external vs. internal validity)
-	Robustness: eg coins (between the games; höhe coins (social psychology. Effekte)
-	IR-Game als verlust frame, stattdessen wäre auch gewinnframe möglich gewesen. Sonst keine motivation nichts zu geben
6 Lessons Learnt
- 	umständliches coding, e.g. treatment if bedingungen statt event listener
6.1 Reflect about what you knew before lecture 1, and what you have
achieved at the end of the course. 
6.2 What recommendations would you give to a future participant of this course and to the lecturer.

-	Little bit html in parts of the team, no experience with experiments at all
-	Some school knowledge in JavaScript (one group member)
-	We developed an elaborated online experimental design on the basis of scientific literature
-	We started almost from scratch and in the end, we ended up with an online experiment that runs without major errors. 
-	6.2 Take more time for coding if your design is somewhat complex
-	Do some JavaScript coding at home, playing around 
-	Lecturer: Provide students with some easy homework (not mandatory) to get some experience how simple coding works (both JavaScript and basic nodegame functions. Some tasks to early start working in the nodegame environment. E.g. “Take the dictator basic game and change some simple details”
