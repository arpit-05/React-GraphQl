import { useEffect,useState } from "react";
import github from "./db";
import NavButtons from "./NavButton";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";

function App() {
  const [userName,setUsername]=useState(" ")
  const [repoList,setReposList]=useState([])
  const [pageCount,setPageCount]=useState(10)
  const [queryString,setQueryString]=useState('')
  const [totalCount, setTotalCount]=useState(null)

  const [startCursor, setStartCursor]=useState(null)
  const [endCursor, setEndCursor]=useState(null)
  const [hasPreviousPage, setHasPreviousPage]=useState(false)
  const [hasNextPage, setHasNextPage]=useState(true)
  const [paginationKeyword, setPaginationKeyword]=useState("first")
  const [paginationString, setPaginationString]=useState("")

  useEffect(() => {
    
    const queryText=JSON.stringify(query(pageCount,queryString,paginationKeyword,paginationString
      ))
    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        const viewer=data.data.viewer
        const repos=data.data.search.edges
        const total=data.data.search.repositoryCount
        const start=data.data.search.pageInfo?.startCursor
        const end=data.data.search.pageInfo?.endCursor
        const next=data.data.search.pageInfo?.hasNextPage
        const prev=data.data.search.pageInfo?.hasPreviousPage
        setUsername(viewer.name)
        //setReposList(viewer.repositories.nodes)
        setReposList(repos)
        setTotalCount(total)
        setStartCursor(start)
        setEndCursor(end)
        setHasNextPage(next)
        setHasPreviousPage(prev)
        console.log(data)
      })
      .catch((error) => console.log(error));
  }, [pageCount,queryString,paginationKeyword,paginationString]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i> Repos
      </h1>
      <p>Hey, {userName}</p>
      {/* <p>
        <b>Search for :</b>{queryString} | <b>Items per page :</b>{pageCount} | <b>Total results :</b>{totalCount}
      </p> */}
      <SearchBox 
      totalCount={totalCount}
      pageCount={pageCount}
      queryString={queryString}
      onTotalChange={(myNumber)=>setPageCount(myNumber)}
      onQueryChange={(myString)=>setQueryString(myString)}
      >
      
      </SearchBox>
      <NavButtons
      start={startCursor}
      end={endCursor}
      next={hasNextPage}
      previous={hasPreviousPage}
      onPage={(myKeyword,myString)=>{
        setPaginationKeyword(myKeyword)
        setPaginationString(myString)
      }}
      ></NavButtons>
      {repoList && (
  <ul className="list-group list-group-flush">
    {repoList.map((repo) => (
      <RepoInfo key={repo.node.id} repo={repo.node}/>
    ))}
  </ul>
)}
    </div>
  );
}

export default App;
