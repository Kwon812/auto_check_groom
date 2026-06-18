class ApiError extends Error {
    details

    constructor(message, details) {
        super(message);
        this.details = details
    }
}

const GOORM_SID = 's%3AWlF9ywFM0TQIS19lHifnqaTii4Paatcr.cA3hhNel9k2RbwiFQrHdB06JWiWNaTWJ6Uj3Q96VqeY'
const ACCOUNTS_SID = 's%3ABYjDvLfpzVuCygF4tj7rhTDC47PROe7R.FaVoS9diMkeW2SSBCltQzuKaRwCwVIx7YVabfof0p%2BM'
const GOORMACOUNTS_SID = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODIwOTM4NjAsIlRva2VuVHlwZSI6ImxldmVsMSIsImlkIjoidHJlNzIzX2l5ZXpvYnJxbSIsImVtYWlsIjoidHJlNzIzX2l5ZXpvYnJxbSIsImNyZWF0ZWRhdGUiOjE3ODE0ODkwNjAsInNlc3Npb25pZCI6Il9fN19VdlRibjdiVVUzOEt5T19zU3lMaTQ4dEctTWRNZlNHZjJqTi1lbjA9IiwiVFRMIjowfQ.mLATeb69L4qNGIACRXox2ZmmaVJc_UmOt_AExFLuBorBGX8ci3vtRoi2qIymFEMPJPMb1v46uvr1VYrKkzYj6En-j-n3siPiurwQ3_ghCslb8YBmbrPTcTYmPI8GiezI48mcyGSv_HVg7P1cFcMETvDP4id-ewsmGF-AfVChVhVliRIygwbQ5dNqI8gsgkaEcSU9uR3zU3Uet0hxbKJEhl-H1mtVfc3CjIG3nZt8f0ZcHDGricbJn59eWmGK4P1zV3zSUE5mn4ooqdtunELbnwG2b_YgpenQe4EM5MPC2fOzxLZb2wPQta7wbE96KpsdKT5UOKr_yADRKTvIWCW5eg'

async function getToken(goormSid, accountsSid, goormAccountsSid) {
    const res = await fetch('https://exp-server.goorm.io/v1/auth/api-tokens/validate', {
        method: 'POST',
        headers: {
            Cookie:
                `  goorm.sid=${goormSid}; accounts.sid=${accountsSid}; goormaccounts.sid=${goormAccountsSid};`,
            'Content-Type': 'application/json',
        }
    })
    if (!res.ok) {
        const error = await res.json()
        console.log(error)
        throw new ApiError('토큰가져오기 에러', error)
    }
    const {tokens: {accessToken}} = await res.json();
    const {token} = accessToken;
    return token
}


async function getTodoListId(token) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/quests/personal', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        throw new ApiError('일일 퀘스트 id가져오기 에러', error)
    }
    const todoList = await res.json()
    return todoList.map(quest => quest.id)

}

async function getGoalQuestId(token) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/quests/personal/goal', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        throw new ApiError('100개 리워드퀘스트 아이디 에러', error)
    }
    const {logs} = await res.json()
    return logs.map(quest => quest.id)

}

async function getPostId(token) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/posts/recent?page=1&limit=1', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!res.ok) {
        const error = await res.json()
        throw new ApiError('블로그 아이디 가져오기 에러', error)
    }
    const [post] = await res.json()
    return post.id
}


async function dailyCheck(token) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/dailyCheck', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },

    })
    if (!res.ok) {
        const error = await res.json()
        console.log('출첵에러',error)
        return
    }
    console.log(`dailyCheck success`)
}


async function postComment(token, roomId) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/comments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "roomId": roomId,
            "roomType": "post",
            "content": "<p>👍</p>"
        })
    })
    if (!res.ok) {
        const error = await res.json()
        console.log(error)
        return
    }
    console.log(`comments at ${roomId}`)
}

async function postLikes(token, roomId) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/reactions/toggle', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "roomId": roomId,
            "roomType": "post",
            "content": "❤️"
        })
    })
    if (!res.ok) {
        const error = await res.json()
        console.log(error)
        return
    }
    console.log(`likes at ${roomId}`)
}

async function finishQuestById(token, questId) {
    const res = await fetch('https://exp-server.goorm.io/v1/organizations/zptxKPcLzHhWNTTf4w/quests/personal/complete', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "questId": questId
        })
    })
    if (!res.ok) {
        const error = await res.json()
        console.log('퀘스트 끝내기 에러 questId:',questId,error)
        return
    }
    console.log(`finished quest ${questId}`)
}

async function aAngGaGGUl() {

    try {
        // 인증용 토큰
        const token = await getToken(GOORM_SID, ACCOUNTS_SID, GOORMACOUNTS_SID)
        // 데일리 미션 아이디
        const todoListQuestId = await getTodoListId(token)
        console.log(`questId:${todoListQuestId}`)
        //데일리 기프트 퀘스트 아이디(25토큰)
        const goalQuestId = await getGoalQuestId(token)
        //출첵
        const daliyC = await dailyCheck(token)
        //
        //좋아요,코멘트 남길 게시글 아이디
        const postId = await getPostId(token)
        console.log('게시글 아이디', postId)
        //좋아요
        const postLike = await postLikes(token, postId)
        //코멘트
        const postComments = await postComment(token, postId)

        //데일리 미션 끝내기
        const finishTodoList = await Promise.all(todoListQuestId.map(questId => finishQuestById(token, questId)))
        const finishTodoList2 = await Promise.all(todoListQuestId.map(questId => finishQuestById(token, questId)))

        //일일 미션 끝내기
        const finishGaol = await Promise.all(goalQuestId.map(questId => finishQuestById(token, questId)))
        // console.log(finishGaol)
        // console.log(goalQuestId)
        //
        //
        // //

        // const res=finishQuestById(token,'quest_Itmn9eGiV3SoeUvh1p')
        // console.log(todoListQuestId)
    } catch (e) {
        if (e instanceof ApiError) {
            console.log(e.message, e.details);
        }
    }
    // console.log(token)
    // console.log(postId)
}

aAngGaGGUl()