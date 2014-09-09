defmodule HelloHandler do
  @behaviour :cowboy_http_handler
  @moduledoc """
  This is a stub handler
  """

  def init({ _any, :http }, req, [file]) do
    req = :cowboy_req.set_resp_header("access-control-allow-methods", "GET, OPTIONS", req)
    req = :cowboy_req.set_resp_header("access-control-allow-origin", "*", req)
    { :ok, req, file }
  end

  def handle(req, state) do
    {timestamp, req} =  :cowboy_req.qs_val("timestamp", req)
    case timestamp do
      :undefined ->
            res = get_response()
            { :ok, req } = :cowboy_req.reply 200, [], res, req
      _ ->  
            t = get_timestamp()
            r = t - String.to_integer(timestamp)
            :io.format("Diff is ~p~n", [r]) 
            IO.binwrite state, "#{t},#{r}\n"
            { :ok, req } = :cowboy_req.reply 200, [], "done", req
    end  
    { :ok, req, state }
  end

  def terminate(_reason, _request, _state) do
    :ok
  end

  def get_timestamp() do
    {mega, sec, micro} = :erlang.now()
    (mega*1000000 + sec)*1000 + round(micro/1000)
  end  

  def get_response() do
        time = get_timestamp() 
        str = :base64.encode(:crypto.strong_rand_bytes(1000))
        :jiffy.encode({[{"timestamp", time}, {"string", str}]})
  end
end
