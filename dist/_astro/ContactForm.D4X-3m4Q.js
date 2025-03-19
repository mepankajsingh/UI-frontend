import{j as e}from"./jsx-runtime.D6DVfyd0.js";import{r as n}from"./index.DSGHSS-j.js";function u(){const[r,m]=n.useState({name:"",email:"",subject:"",message:""}),[s,i]=n.useState({submitted:!1,submitting:!1,info:{error:!1,msg:null}}),t=a=>{m({...r,[a.target.name]:a.target.value})},l=async a=>{a.preventDefault(),i(d=>({...d,submitting:!0})),setTimeout(()=>{i({submitted:!0,submitting:!1,info:{error:!1,msg:"Thank you! Your message has been sent."}}),m({name:"",email:"",subject:"",message:""})},1500)};return e.jsxs("form",{onSubmit:l,className:"space-y-6",children:[s.info.error&&e.jsx("div",{className:"bg-red-50 border-l-4 border-red-400 p-4",children:e.jsx("div",{className:"flex",children:e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm text-red-700",children:s.info.msg})})})}),s.submitted&&!s.info.error&&e.jsx("div",{className:"bg-green-50 border-l-4 border-green-400 p-4",children:e.jsx("div",{className:"flex",children:e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm text-green-700",children:s.info.msg})})})}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block text-sm font-medium text-secondary-text",children:"Name"}),e.jsx("div",{className:"mt-1",children:e.jsx("input",{type:"text",name:"name",id:"name",required:!0,className:"block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",value:r.name,onChange:t})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-secondary-text",children:"Email"}),e.jsx("div",{className:"mt-1",children:e.jsx("input",{type:"email",name:"email",id:"email",required:!0,className:"block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",value:r.email,onChange:t})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"subject",className:"block text-sm font-medium text-secondary-text",children:"Subject"}),e.jsx("div",{className:"mt-1",children:e.jsx("input",{type:"text",name:"subject",id:"subject",required:!0,className:"block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",value:r.subject,onChange:t})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"message",className:"block text-sm font-medium text-secondary-text",children:"Message"}),e.jsx("div",{className:"mt-1",children:e.jsx("textarea",{name:"message",id:"message",rows:5,required:!0,className:"block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",value:r.message,onChange:t})})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",disabled:s.submitting,className:"inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",children:s.submitting?"Sending...":"Send Message"})})]})}export{u as default};
