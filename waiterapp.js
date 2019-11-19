module.exports = function (pool) {

    async function shiftDays () {
        const daysOfTheWeek = await pool.query('select * from shifts')
        
        return daysOfTheWeek.rows
      }

      async function newWaiter (waiter) {
        waiter.toUpperCase()
        let waiterName = await pool.query('select * from waiter where waiter_name =$1', [waiter])
        
        let waiterSel = waiterName.rowCount
        if (waiterSel === 0) {
          await pool.query('insert into waiter(waiter_name) values($1)', [waiter])
          console.log(waiterSel);
          
        }
      }

      async function waiterReq(){
        waiterWanted = await pool.query('select waiter_name from waiter')
        const listOfWaiters = [];
        for (var i = 0; i < waiterWanted.rows.length; i++) {
            listOfWaiters.push(waiterWanted.rows[i].waiter_name);
        }
        return listOfWaiters
      }

    return{
        shiftDays,
        newWaiter,
        waiterReq
    }

}