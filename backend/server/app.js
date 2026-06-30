console.log("◇ Bootstrapping the app . . .")

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const {logger} = require('./middleware/logger.middleware')

//middleware setup
app.use(logger)
app.use(cors())
app.use(express.json())


//routes setup
const AuthRouter = require('./routes/auth.routes')
app.use('/api/auth', AuthRouter)

const RoleRouter = require('./routes/role.routes')
app.use('/api/roles', RoleRouter)

const RegionRouter = require('./routes/region.routes')
app.use('/api/regions', RegionRouter)

const SeasonRouter = require('./routes/season.routes')
app.use('/api/seasons', SeasonRouter)

const PlayerRouter = require('./routes/player.routes')
app.use('/api/players', PlayerRouter)

const TeamRouter = require('./routes/team.routes')
app.use('/api/teams', TeamRouter)

const ScoringRuleRouter = require('./routes/scoring_rule.routes')
app.use('/api/scoring-rules', ScoringRuleRouter)

const MatchRouter = require('./routes/match.routes')
app.use('/api/matches', MatchRouter)

const ContractRouter = require('./routes/contract.routes')
app.use('/api/contracts', ContractRouter)

const StatRouter = require('./routes/stat.routes')
app.use('/api/stats', StatRouter)

const UserRouter = require('./routes/user.routes')
app.use('/api/users', UserRouter)

const FantasyTeamRouter = require('./routes/fantasy_team.routes')
app.use('/api/fantasy-teams', FantasyTeamRouter)

const FantasyLeagueRouter = require('./routes/fantasy_league.routes')
app.use('/api/fantasy-leagues', FantasyLeagueRouter)

const FantasyLeagueMembershipRouter = require('./routes/fantasy_league_membership.routes')
app.use('/api/fantasy-league-memberships', FantasyLeagueMembershipRouter)

const FantasyContractRouter = require('./routes/fantasy_contract.routes')
app.use('/api/fantasy-contracts', FantasyContractRouter)

const archiveImageRoutes = require("./routes/archive_image.routes")
app.use("/api/images", archiveImageRoutes)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, ()=>{
    console.log("◇ Backend listening on port: " + PORT)
})
