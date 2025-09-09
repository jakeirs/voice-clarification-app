'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const componentQuestions = [
  {
    question: "What is this component's single, specific job, and what does it look like by default?",
    tip: "Think about: What is its one and only function? (e.g., \"To display a summary of a project,\" \"To let a user confirm an action\"). Describe its normal, resting appearance. What are its core visual parts (e.g., an icon, a title, a subtitle)?"
  },
  {
    question: "How exactly does a user interact with it? Is it a tap, a long press, a swipe, or typing?",
    tip: "Think about: The physical interaction. Be specific. \"The user taps anywhere on the card,\" \"The user must tap the tiny 'x' icon,\" \"The user swipes it to the left to reveal delete button.\""
  },
  {
    question: "When you interact with it, what's the immediate, satisfying feedback that tells you 'it worked'?",
    tip: "Think about: The micro-interaction. Does it change color on tap? Does it scale up slightly? Does the phone give a little vibration? Describe the small detail that makes it feel responsive and alive."
  }
];

const screenQuestions = [
  {
    question: "How should this screen *feel*?",
    tip: "If this screen were a room, what kind of room would it be? (e.g., A library? A workshop? A clean, minimalist gallery?) Describe its personality."
  },
  {
    question: "What is the single most important action, and how does the user take it?",
    tip: "Is there a big, obvious button? Do they swipe on something? Do they tap on a card? Describe the main button or interactive element and where it lives on the screen."
  },
  {
    question: "After the user acts, what happens next that makes them feel successful?",
    tip: "Describe the immediate feedback. \"After they hit 'Save,' a green checkmark animates in, and a small message at the bottom says 'Project Created.' It should feel fast and rewarding.\""
  },
  {
    question: "What does this look like when it's empty?",
    tip: "Picture a brand new user. Describe the screen they see. Is there an illustration? A friendly message? A clear button to guide them to their first action?"
  },
  {
    question: "What's a small, delightful detail that would make someone smile?",
    tip: "Think about one tiny detail. Maybe it's the way the list items animate in one by one. Maybe it's a clever loading animation. Describe one small piece of \"polish.\""
  }
];

const screenChecklist = [
  "I know what the user wants to accomplish here",
  "I can describe the layout and visual hierarchy",
  "I understand all the different states this screen has",
  "I know what happens when users interact with elements",
  "I see how this fits into the app flow"
];

const componentChecklist = [
  "I'm clear on what behavior this component provides",
  "I know what data it handles and how it changes",
  "I can picture the different visual states and edge cases",
  "I understand how it communicates with other parts",
  "I see how it can be reused and maintained"
];

export function HelpfulQuestions() {
  return (
    <Collapsible className="mb-6">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 justify-between">
          <span className="text-sm font-medium">Thinking Framework - Before Recording</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-4">
        <Tabs defaultValue="component" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="component" className="text-white/90">Component</TabsTrigger>
            <TabsTrigger value="screen" className="text-white/90">Screen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="component" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Questions for a COMPONENT:</h3>
              
              {componentQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-base font-medium text-white leading-relaxed">
                    {index + 1}. {item.question}
                  </h4>
                  <p className="text-sm text-white/70 italic pl-4 border-l-2 border-white/20">
                    {item.tip}
                  </p>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-base font-medium text-white mb-3">For Components:</h4>
                <ul className="space-y-2">
                  {componentChecklist.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-white/80">
                      <span className="text-white/50 mt-0.5">□</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="screen" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Questions for a SCREEN:</h3>
              
              {screenQuestions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-base font-medium text-white leading-relaxed">
                    {index + 1}. {item.question}
                  </h4>
                  <p className="text-sm text-white/70 italic pl-4 border-l-2 border-white/20">
                    {item.tip}
                  </p>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-base font-medium text-white mb-3">For Screens:</h4>
                <ul className="space-y-2">
                  {screenChecklist.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-white/80">
                      <span className="text-white/50 mt-0.5">□</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}