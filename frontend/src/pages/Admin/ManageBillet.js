import SearchBox from '../../components/Admin/billet/SearchBox'
import BilletTable from '../../components/Admin/billet/BilletTable'
import Main from '../../components/Admin/billet/Main'

import {TitleTypography} from '../../components/StyledComponents';
function ManageBillet() {
  return (
    <div className="flex min-h-screen pt-0">
      <main className="flex-1">
      <TitleTypography
      >
        ticket management
      </TitleTypography>
        <SearchBox />
        <BilletTable />
        <Main />
      </main>
    </div>
  )
}

export default ManageBillet
