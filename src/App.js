import React, {Component} from 'react';
import FBCommentsPuller from './fb-comments-puller';
import update from 'react-addons-update';

class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isStarted: false
        ,   token: ''
        ,   postId: ''
        ,   comments: []
        ,   newComments: []
        ,   summaryTotalCount: 0
        ,   responseTotalCount: 0
        ,   summaryTotalCountDelta: 0
        ,   responseTotalCountDelta: 0
        };
        FBCommentsPuller.onUpdate = this.onUpdate;
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    start = () =>
    {
        if (!this.state.token && !this.state.postId) return;
        FBCommentsPuller.start(this.state.token, this.state.postId);
        this.setState(update(this.state, {isStarted : {$set: true}}));
    };

    stop = () =>
    {
        FBCommentsPuller.stop();
        this.setState(update(this.state, {isStarted : {$set: false}}));
    };

    onUpdate = (datas) =>
    {
        this.setState({
            isStarted: this.state.isStarted
        ,   ...datas
        })
    };

    render()
    {
        const isStarted = this.state.isStarted;
        return (
            <div className="container">
                <div className="col-md-8 col-md-offset-2">
                    <h1 className="page-header">FB Graph API comments edge issue</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="token">Token</label>
                            <input className="form-control"
                               id="token"
                               name="token"
                               value={this.state.token}
                               onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="post-id">Post ID</label>
                            <input className="form-control"
                               id="post-id"
                               name="postId"
                               value={this.state.postId}
                               onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            {isStarted ? (
                                <button className="btn btn-warning" type="button" onClick={this.stop}>Stop</button>
                            ) : (
                                <button className="btn btn-success" type="button" onClick={this.start}>Start</button>
                            )}
                        </div>
                    </form>
                    <h3 className="page-header">Results</h3>
                    <div class="col-xs-4">
                        <h4>Summary : {this.state.summaryTotalCount} {this.state.summaryTotalCountDelta < 0 ? this.state.summaryTotalCountDelta:'+'+this.state.summaryTotalCountDelta}</h4>
                        <h4>Response : {this.state.responseTotalCount} {this.state.responseTotalCountDelta < 0 ? this.state.responseTotalCountDelta:'+'+this.state.responseTotalCountDelta}</h4>
                    </div>
                    <div class="col-xs-8">
                        {
                            this.state.comments.map((comment)=>
                            {
                                return (
                                    <div class="media">
                                        <div class="media-left">
                                            <img class="media-object" src={comment.from.picture.data.url}/>
                                        </div>
                                        <div class="media-body">
                                            <h4 class="media-heading">{comment.from.name}</h4>
                                            {comment.message}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;