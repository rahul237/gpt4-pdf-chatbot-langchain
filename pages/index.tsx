import React, { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import Dropdown from './dropdown';
import DropdownComponent from './dropdown_component';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this chapter?',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    console.log(selectedNamespace);

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('talk/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
          namespace: selectedNamespace,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.text,
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center" style={{padding:"30px"}}>
            Chat With NCERT
          </h1>
          <div>
          {/* <Dropdown></Dropdown> */}
          <DropdownComponent onNamespaceChange = {setSelectedNamespace} style={{padding:"30px"}}></DropdownComponent>
        </div>
        {!selectedNamespace &&
        <div style={{margin:"0 auto", color:"gray"}}>
          Please select a chapter and click submit to continue
          <Image src={'https://lh3.googleusercontent.com/pw/ADCreHcFv6CrsLK54UtQqhz87Ukb2_5ZDmm6hcaeMRkqpMjfSVR0W0IM3LekHq_ZzKOubYuXDmVXZiZDT7jBsWhswsPhORrmHc9vtB989Z2HoFRwbJdF4OeC-34_PAL2qJy299frDP6HNErgNua42o9awN17rQIXg1Z07HUqO1T464FBltwujVod2N4XWVMNcT5HIaRnHVqjKL4zF_5sHCmhD6-Oq77LpKgIteNRvy7oGB605XSt0uRP6SYOIt_N8NSa2PDJyC6q0fzu_dV1oJK7S5jDwCcWIDTT_6x4YsLxyIo62HUEJ0TVTnrZEOsUst8q7RNLp3gHgl6shQeJztbFNQVBlaNNCzzYMUD-i3nk9Ik8q5aZ0Ap4dT-tnUAplk-Ia9BmjI1YbCMRob63Y9KuWDo4OvWw0_RfyOlt4NlkVeIpOTKbUuOeQo5lCfT4ZdVqZrfmW1nBH6gowJPLq8hzwUsUEtSFZ_H5EUWC7VJ_I9Mk24yWn-ZeRKbY2eZ0PF7Bk3fshv-LsAcigt5S50WrYF8-hjgIvW3q9PAKYRbuJKK3qgVeQ6F2CaRNMATYiYw2YQPvziV_jIBIaz_96q2lfIrkBJgkqgZUgDMp7mn5jVQ252LqNbSwMPEg3ZRwjFyjwWykEoMMBGj3S0CcVj5UiYYa0dl_BgK3IB_e8aSS1f4-xl2aOy9Rel7i5GKoowFJ3Mcp-Mxk8JrhwS6osvFyziCc9M3NoLbQJzgIuwGj6oGnpgANIXOgPGUVLXpVFsn2m9aT-2Vhw278WBRkp_fS0r_HVs2_c9Q_hwU4Hqr5WDhHHuANVxyjMis7UIZcQ7ZleDKQaIi6Y4rJuAiMJGUy1DlfF2ei3EWENFib6R3pq8fdM0Rk_PlMoPEeNXNYOeE4dnSzzja3mD-InPhLLCPH_W0tVcyiQT458EPrvzJM7-8VuWXPbn0EddH-UYehwLiwvW3GdajlDn9UDItvuv266ziRl8qhZ5PQ=w1024-h1024-s-no?authuser=0'} alt='banner' width="300" height="300" style={{margin:"auto"}}/>
        </div>}
        {selectedNamespace && 
          <main className={styles.main}>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  let icon;
                  let className;
                  if (message.type === 'apiMessage') {
                    icon = (
                      <Image
                        key={index}
                        src="/bot-image.png"
                        alt="AI"
                        width="40"
                        height="40"
                        className={styles.boticon}
                        priority
                      />
                    );
                    className = styles.apimessage;
                  } else {
                    icon = (
                      <Image
                        key={index}
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority
                      />
                    );
                    // The latest message sent by the user will be animated while waiting for a response
                    className =
                      loading && index === messages.length - 1
                        ? styles.usermessagewaiting
                        : styles.usermessage;
                  }
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.sourceDocs && (
                        <div
                          className="p-5"
                          key={`sourceDocsAccordion-${index}`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="flex-col"
                          >
                            {message.sourceDocs.map((doc, index) => (
                              <div key={`messageSourceDocs-${index}`}>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger>
                                    <h3>Source {index + 1}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>
                                    <p className="mt-2">
                                      <b>Source:</b> {doc.metadata.source}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response...'
                        : 'What do you want to ask me about this chapter?'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="#000" />
                      </div>
                    ) : (
                      // Send icon SVG in input field
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </main>}
        </div>
        <footer className="m-auto p-4">
          <a href="https://twitter.com/mayowaoshin">
            {/* Powered by LangChainAI. Demo built by Mayo (Twitter: @mayowaoshin). */}
          </a>
        </footer>
      </Layout>
    </>
  );
}
