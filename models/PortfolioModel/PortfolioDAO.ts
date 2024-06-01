import Portfolio  from "./portfolio"
interface PortfolioDAO { 
    addPortfolio(Portfolio: Portfolio) : Promise<Boolean> 
    deletePortfolio(id: number) : Promise<void>
    updatePortfolio(filter:any, updateData:any) : Promise<void>
    getPortfolio(id:number) : Promise<Portfolio> 
    getAllPortfolios() : Promise<Portfolio[]>
    searchPortfolios(filter:any) : Promise<Portfolio[]>
}
export default PortfolioDAO