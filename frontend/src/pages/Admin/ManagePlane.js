import SearchBox from '../../components/Admin/plane/SearchBox'
import PlaneTable from '../../components/Admin/plane/PlaneTable'
import Main from '../../components/Admin/plane/Main'

import {TitleTypography} from '../../components/StyledComponents';
function ManagePlane() {
  return (
    <div className="flex min-h-screen pt-0">
      <main className="flex-1">
      <TitleTypography
      >
        plane management
      </TitleTypography>
        <SearchBox />
        <PlaneTable />
        <Main />
      </main>
    </div>
  )
}

export default ManagePlane
