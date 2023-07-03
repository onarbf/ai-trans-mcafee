'use client'

import { useCompletion } from 'ai/react'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export default function Completion() {
  const [language, setLanguage] = useState('english');
  const [htmlType, setHtmlType] = useState('ngm');
  const [parsedCompletion, setParsedCompletion] = useState("{}");
const x = {"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}
  const {
    completion,
    input,
    setInput,
    stop,
    isLoading,
    handleInputChange,
    setCompletion,
    handleSubmit
  } = useCompletion({
    api: '/api/completion',
    body: {
      language,
      htmlType
    }
  })
  useEffect(()=>{
    console.log(isJsonString(completion));
    if(isJsonString(completion)){
      setParsedCompletion(JSON.parse(completion));
    }
  },[completion])
  return (
    <div className="flex flex-col bg-slate-800 min-h-[100vh] flex items-center justify-center text-sm">
      <div className="flex flex-col border rounded shadow min-h-[90vh] grow w-[90vw] bg-white">
        <div className="">
          <div className="p-4 grow flex text-center justify-center">
            <h1 className="text-xl font-semibold text-black"> Mcafee Translator</h1>
          </div>
        </div>

        <div className="flex flex-col px-4 py-4 borde grow">
          <div className="flex gap-4  grow">
            <div className="flex flex-col border grow rounded p-2 w-1/2">
              <div className="">
                <h2>Add here your html</h2>
              </div>
              <div className="flex flex-col w-full grow ">
                <div className="flex py-2 gap-4">
                  <div className="grow">
                  <select onChange={(e)=>setHtmlType(e.target.value)} id="countries" className=" border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                    <option value="ngm">NGM</option>
                    <option value="email">Email</option>
                    
                  </select>
                  </div>
                  <div className="grow">
                  <select onChange={(e)=>{
                    console.log(htmlType)
                    setLanguage(e.target.value)}} id="countries" className=" border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="italian">Italian</option>
                  </select>
                  </div>
                  <div>
                  <form onClick={handleSubmit}>
                    <button className="px-2 py-2 text-white bg-blue-400 crounded border" disabled={isLoading} type="submit">
                      Translate!
                    </button>
                  </form>
                  </div>
                  <div >
                  <button className="px-2 py-2 text-white bg-slate-400 rounded border" type="button" onClick={()=>{
                    setInput('');
                    setCompletion('');
                  }}>
                      Reset
                  </button>

                  </div>
                  
                </div>
                <form className="flex flex-col w-full grow">
                  <textarea className="border w-full grow rounded p-2"
                    value={input}
                    onChange={handleInputChange} />
                </form>
              </div>
            </div>

            <div className="flex flex-col border grow rounded p-2 w-1/2">
              <div className="">
                <h2>You will see here the output</h2>
              </div>
              <div className="flex flex-col gap-2 grow bg-white">
                 {/* @ts-ignore  */}
                {htmlType==='email' && parsedCompletion !== "{}" && <DynamicReactJson src={parsedCompletion}/>}
                {htmlType==='email' && parsedCompletion === "{}"&& <output className="flex h-1/3 grow flex-col w-full border rounded overflow-y-scroll">{completion}</output>}
                {htmlType==='ngm' && <output className="h-1/2 max-h-[300px] border rounded overflow-y-scroll">{completion}</output>}
                {/* @ts-ignore  */}
                {htmlType==='ngm' && <output className="h-1/2 grow w-full h-full pb-6 pt-2 px-2 flex justify-center border rounded" dangerouslySetInnerHTML={{__html:completion}}></output>}
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const  isJsonString = (str: string)=>{
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}