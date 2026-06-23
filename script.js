class ApiError extends Error {
    details

    constructor(message, details) {
        super(message);
        this.details = details
    }
}

const GOORM_SID = 's%3AaVSmYdDoD8XO7OJk9IxRG5cYRSdr5rhP.vhxn1SDaZYESo2Loge%2B8B6P01HKNJm9PaIbsKyaVjGU'
const ACCOUNTS_SID = 's%3AVpF2Om_olt1NI9qoRkPWFEVcSbM5E40R.nS64dnWcQVmswPx6gH9uxQxR%2FPslI2%2FbApORq%2BXLnC4'
const GOORMACOUNTS_SID = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODI3MTI4NjgsIlRva2VuVHlwZSI6ImxldmVsMSIsImlkIjoidHJlNzIzX2l5ZXpvYnJxbSIsImVtYWlsIjoidHJlNzIzX2l5ZXpvYnJxbSIsImNyZWF0ZWRhdGUiOjE3ODIxMDgwNjgsInNlc3Npb25pZCI6InZUY002dHFHbjJKYk10MGlUUmw2WTV4UHVraGlZeG9OVFhtV0lCVUdXdGM9IiwiVFRMIjowfQ.RKOZnDA-lfiocAUO50IK6sxWfFZr1gL49PeTNATtKVnONbPYjUEyYgb2NSf4tAF0jTVc6y6kr_E_P04zYyGhrt41MLnHCMjYjMYjE4oI4UfXD6lapu9YXNE0DvV_7f9gtNpQ47-n9uybQUAjQQ3u5-ctimRj_jUe-8C9k1byThu2IdhodN-7qRzFAQMtzEHtVKLWEKNC7Op6jvk2sB00F8ZCAXg9Is2lB62kEFerZn16i5b2Y1OS-YDUoGoadRqsoy_W56LQBip5cKLtgjcE5XX04IYeq-OmZo6F9mqprKqgjBGXuO7HWs2CLF7th49trelx038Pe2w_t3vOGKjwcQ'

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
        throw new ApiError('[error] get Token Error', error)
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
        throw new ApiError('[error] get DailyQuestId error', error)
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
        throw new ApiError('[error] get GoalQuestId error', error)
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
        throw new ApiError('[error] get postId error', error)
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
        console.log('[error] dailyCheck error',error)
        return
    }
    console.log(`[success] dailyCheck success`)
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
        console.log('[error]comments error',error)
        return
    }
    console.log(`[success] comments at ${roomId}`)
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
        console.log('[error]likes error',error)
        return
    }
    console.log(`[success] likes at ${roomId}`)
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
        console.log('[error] finished quest Error questId:',questId,error)
        return
    }
    console.log(`[success] finished quest ${questId}`)
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
        console.log('postId:', postId)
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