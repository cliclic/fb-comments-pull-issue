class FBCommentsPuller
{
    constructor()
    {
        this.idsCache = new Map();
        this.accessToken = '';
        this.postId = '';
        this.isStarted = false;
        this.onUpdate = null;
        this.timeoutId = null;
        this.interval = 5000;
    }

    start (accessToken, postId)
    {
        if (this.isStarted) return;
        this.isStarted = true;
        this.accessToken = accessToken;
        this.postId = postId;
        this.initialPull();
    };

    stop ()
    {
        this.accessToken = '';
        this.postId = '';
    };

    initialPull ()
    {
        global.FB.api('/'+this.postId, {
            //sliding minute range :
            //fields: `comments.order(reverse_chronological).summary(total_count).since(${ Math.round(Date.now()/1000) - 60 }){id, message, from{name, picture}}`

            //200 last comments
            fields: `comments.filter(stream).order(reverse_chronological).summary(total_count).limit(200){id, message, from{name, picture}}`
        ,   access_token: this.accessToken
        }, this.handleInitialResponse);
    }

    handleInitialResponse = (response) =>
    {
        console.log (response);
        if (!response)
        {
            console.error('error occured');
            this.stop();
            return;
        }
        if (response.error)
        {
            console.error(response.error);
            this.stop();
            return;
        }

        this.responseTotalCount = this.summaryTotalCount = response.comments.summary.total_count;

        response.comments.data.forEach((comment) => {
            this.idsCache.set(comment.id, true);
        });

        this.onUpdate({
            summaryTotalCount: this.summaryTotalCount
        ,   summaryTotalCountDelta: 0
        ,   responseTotalCount: this.responseTotalCount
        ,   responseTotalCountDelta: 0
        ,   newComments: []
        ,   comments: response.comments.data
        });

        this.timeoutId = setTimeout(this.pull, this.interval);
    };

    pull = ()=>
    {
        global.FB.api('/'+this.postId, {
            //sliding minute range :
            //fields: `comments.order(reverse_chronological).summary(total_count).since(${ Math.round(Date.now()/1000) - 60 }){id, message, from{name, picture}}`

            //200 last comments
            fields: `comments.filter(stream).order(reverse_chronological).summary(total_count).limit(200){id, message, from{name, picture}}`
        ,   access_token: this.accessToken
        }, this.handleResponse);
    };

    handleResponse = (response) =>
    {
        console.log (response);
        if (!response)
        {
            console.error('error occured');
            this.timeoutId = this.setTimeout(this.pull, this.interval);
            return;
        }
        if (response.error)
        {
            console.error(response.error);
            this.timeoutId = this.setTimeout(this.pull, this.interval);
            return;
        }

        let newComments = response.comments.data.filter((comment) => {
            if (this.idsCache.has(comment.id)) return false;
            this.idsCache.set(comment.id, true);
            return true;
        });

        let summaryTotalCountDelta = response.comments.summary.total_count - this.summaryTotalCount;
        this.responseTotalCount = this.responseTotalCount+newComments.length;
        this.summaryTotalCount = response.comments.summary.total_count;

        this.onUpdate({
            summaryTotalCount: this.summaryTotalCount
        ,   summaryTotalCountDelta
        ,   responseTotalCount: this.responseTotalCount
        ,   responseTotalCountDelta: newComments.length
        ,   newComments
        ,   comments: response.comments.data
        });

        this.timeoutId = setTimeout(this.pull, this.interval);
    }
}

export default new FBCommentsPuller ();
