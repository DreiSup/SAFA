import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { financeService, type DashboardData } from '@/services/financeService'
import React, { useState } from 'react'

const Home = () => {


    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<DashboardData | null>(null)
    const [error, setError] = useState<string | null>(null)


    const loadData = async () => {
        try {
            setLoading(true);
            const [dashData, transData] = await Promise.all([
                financeService.getDashboard(),
                financeService.getTransactions()
            ]);
            
            setDashboard(dashData);
            setTransactions(transData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDashboard = async () => {
        try {
            console.log("klk manins")
            const result = await financeService.getDashboard();
            console.log(result)
            setData(result)
        } catch (err: unknown) {
            console.log(err)
        }
    }






    const handleDeleteAll = async () => {
        /* Cambiar a un componente shadcn */
        const confirmacion = confirm("Estás seguro de que quieres borrar todas las transacciones?") 

        if (confirmacion) {
            try {
                await financeService.deleteAllTransactions()
                loadData()
                alert("Base de datos reiniciada")
            } catch (error) {
                console.log(error)
            }

        }
    }


  return (
    <>
        <div className=''>Home</div>

        <div>
            <Button onClick={loadDashboard} variant="outline">
                Recargar
            </Button>
            <Button onClick={handleDeleteAll} variant="outline">
                Borrar todo
            </Button>

        </div>

        



        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { data ? 
                    data.desglose_por_categoria.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.categoria}</TableCell>
                        <TableCell className='text-right'>
                            {item.total}
                        </TableCell>
                    </TableRow>
                    ))
            :
            <></>}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>
  )
}

export default Home